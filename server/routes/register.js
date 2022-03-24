const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AWS = require('@aws-sdk/client-ses');
var router = express.Router();
const db = require('../db');

router.post('/new', async (req, res) => {
    email = req.body.email;
    pass = req.body.pass;
    first = req.body.first;
    last = req.body.last

    if (!(email && pass && first && last)) {
        res.status(400).send("All data must be sent to this endpoint");
    }

    try {
        const duplicate = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (duplicate.rows[0]) {
            res.status(202).json({result: false});
            return;
        }
    } catch (err) {
        console.log(err);
    }
    bcrypt.hash(pass, 10, async (err, hash) => {
        try {
            await db.query("INSERT INTO users (first_name, last_name, email, pass) VALUES ($1, $2, $3, $4)", [
                first, last, email, hash])
                res.status(201).json({result: true});
        } catch (err) {
            console.log(err);
            res.status(400).send('Failed to create user');
            
        }      
    })
})

router.post('/requestUpdate', async (req, res) => {
    if (!req.body.email) {
        res.status(400).send({success: false});
        return;
    }

    var inResets = false;

    try {
        const check = await db.query('SELECT * FROM resets WHERE email = $1', [req.body.email]);
        if (check.rows[0]) {
            inResets = true;
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({success: false});
        return;
    }

    const resetToken = crypto.randomUUID();
    var writeError = false;

    try {
        bcrypt.hash(resetToken, 10, async (err, hash) => {
            if (inResets) {
                await db.query('UPDATE resets SET token = $1, expired = false, time = CURRENT_TIMESTAMP WHERE email = $2;', [hash, req.body.email]);
            } else {
                await db.query('INSERT INTO resets (email, token, time) VALUES ($1, $2, CURRENT_TIMESTAMP);', [req.body.email, hash]);
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({success: false});
        return;
    }

    if (writeError) {
        res.status(400).send({success: false});
        return;
    }

    const ses = new AWS.SESClient({region: 'us-west-2'})
    const params = {
        Destination: {
          CcAddresses: [
            
          ],
          ToAddresses: [
            req.body.email
          ],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              // edit this to change email body
              Data: "<div>Hello,</div>" +
                    "<br><div>A request to reset your password has been made. If you made this request, click the link below to continue.</div>"+
                    `<br><div><a href='hack.gt-robotech.com/reset/${resetToken}'>Password Reset</a>` +
                    "<br><br><div>If the above link does not work, copy and paste the URL below into your browser: hack.gt-robotech.com/reset/" + resetToken + "</div>" + 
                    "<br><div>If you did not make this request, or you have any other problems, please contact us at gatechieee@gmail.com.</div>" + 
                    "<br><div>Best,</div>" + 
                    "<br><div>GT IEEE.</div>",
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "RoboTech Password Reset",
          },
        },
        Source: "admin@gt-robotech.com", // SENDER_ADDRESS
        ReplyToAddresses: [
          "arieck3@gatech.edu",
          "hsapra3@gatech.edu"
        ],
      };

      try {
          await ses.send(new AWS.SendEmailCommand(params));
          res.status(200).send({success: true});
          return;
      } catch (err) {
          console.log(err);
          res.status(500).send({success: false});
          return;
      }

})

router.post('/update', async (req, res) => {
    if (!(req.body.email && req.body.token && req.body.newPass)) {
        res.status(400).send({success: false});
        return;
    }

    var resetRow;

    try {
        resetRow = await db.query('SELECT * FROM resets WHERE email = $1;', [req.body.email]);
    } catch (err) {
        res.status(200).send({success: false, message: 'Could not find a reset token matching this email'});
        return;
    }

    
    if (!resetRow.rows[0]) {
        res.status(200).send({success: false, message: 'Could not find a reset token matching this email'});
        return;
    }

    /*var tokenTimeStamp = new Date(resetRow.rows[0].time);
    tokenTimeStamp.setHours(tokenTimeStamp.getHours() - 4); // time zone correction
    var currTimeStamp = new Date();
    const twoHoursToMS = 7200000;*/

    if (resetRow.rows[0].expired) {
        res.status(200).send({success: false, message: 'This reset token is expired! Please request a new one'});
        return;
    }


    bcrypt.compare(req.body.token, resetRow.rows[0].token, (err, result) => {
        if (result) {
            bcrypt.hash(req.body.newPass, 10, async (err, hash) => {
                try {
                    await db.query('UPDATE users SET pass = $1 WHERE email = $2;', [hash, req.body.email]);
                    await db.query('UPDATE resets SET expired = true WHERE email = $1;', [req.body.email]);
                } catch (err) {
                    console.log(err);
                    res.status(200).send({success: false, message: 'Failed to update password! Please try again later'});
                    return;
                }
            })
        }
        else {
            res.status(200).send({success: false, message: 'This reset token does not match the one sent to this email'});
            return;
        }
    })

    res.status(200).send({success: true, message: 'Password reset succesfully! You may now return to log in'});

})

module.exports = router;