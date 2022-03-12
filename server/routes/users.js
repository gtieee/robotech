const express = require('express');
const auth = require('../middleware/auth.js');
const admin = require('../middleware/admin.js');
const AWS = require('@aws-sdk/client-ses');
var router = express.Router();

const db = require('../db');
const { RowDescriptionMessage } = require('pg-protocol/dist/messages');

router.post('/', admin, async (req, res) => {
    const data = await db.query("SELECT * FROM users;");
    res.send(data.rows);
})

router.get('/stats', admin, async (req, res) => {
    if (!req.headers.authorization || (req.headers.authorization != 'rt-admin')) {
        res.status(403).send('Unauthorized');
        return;
    }

    var data = {registered: 0, applied: 0, accepted: 0};

    try {
        data.registered = (await db.query("SELECT * FROM users;")).rows.length;
    } catch {
        res.status(500).send('Failed to fetch from users database');
        return;
    }
    try {
        data.applied = (await db.query("SELECT * FROM applications;")).rows.length;
    } catch {
        res.status(500).send('Failed to fetch from applications database');
        return;
    }
    try {
        data.accepted = (await db.query("SELECT * FROM users WHERE accepted = true;")).rows.length;
    } catch {
        res.status(500).send('Failed to fetch from users database');
        return;
    }

    res.status(200).send(data);

})

router.get('/checkAuth', auth, async (req, res) => {
    res.status(200).send({authed: true});
})

router.post('/checkAdmin', admin, async (req, res) => {
    res.status(200).send({admin: true});
})

router.post('/hasInfo', auth, async (req, res) => {
    if (!req.body.userId) {
        res.status(200).json({hasInfo: false})
        return;
    }
    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1;', [req.body.userId]);
        if (userRow.rows[0].apply_id) {
            res.status(200).json({hasInfo: true});
        } else {
            res.status(200).json({hasInfo: false});
        }
    } catch (err) {
        console.log(err);
        res.status(200).json({hasInfo: false});
    }
})

router.post('/name', admin, async (req, res) => {
    if (!req.body.userId) {
        res.status(400);
        return;
    }
    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1;', [req.body.userId]);
        if (!userRow.rows[0]) {
            res.status(400);
            return;
        }
        res.status(200).json({first: userRow.rows[0].first_name, last: userRow.rows[0].last_name});
        return;
    } catch (err) {
        console.log(err)
        res.status(500);
        return;
    }
})

router.post('/applyData', admin, async (req, res) => {
    if (!req.body.userId) {
        res.status(400);
        return;
    }
    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1;', [req.body.userId]);
        const applyId = userRow.rows[0].apply_id;
        const applyRow = await db.query('SELECT * FROM applications WHERE id = $1;', [applyId]);
        if (!applyRow.rows[0]) {
            res.status(400);
            return;
        }
        res.status(200).json(applyRow.rows[0]);
        return;
    } catch (err) {
        console.log(err)
        res.status(500);
        return;
    }
})

router.post('/accept', admin, async (req, res) => {
    if (!req.body.userId) {
        res.status(400);
        return;
    }

    var userEmail;

    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1', [req.body.userId]);
        if (!userRow.rows[0]) {
            res.status(400);
            return;
        }
        userEmail = userRow.rows[0].email;
    } catch (err) {
        console.log(err);
        res.status(400);
        return;
    }

    const ses = new AWS.SESClient({region: 'us-west-2'})
    const params = {
        Destination: {
          CcAddresses: [
            
          ],
          ToAddresses: [
            userEmail
          ],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              // edit this to change email body
              Data: "<div>Congratulations! We are happy to inform you that you have been accepted to RoboTech!</div>" +
                    "<br><div> We hope to see you on April 1st! Please fill out the following form to confirm your acceptance!</div>",
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "RoboTech Acceptance",
          },
        },
        Source: "admin@gt-robotech.com", // SENDER_ADDRESS
        ReplyToAddresses: [
          "arieck3@gatech.edu",
          "hsapra3@gatech.edu"
        ],
      };
    try {
        const data = await ses.send(new AWS.SendEmailCommand(params));
        await db.query('UPDATE users SET accepted = true WHERE id = $1', [req.body.userId]);
        res.status(200).send({success: true});
        return;
    } catch (err) {
        console.log(err);
        res.status(400);
        return;
    }
})

router.post('/checkAccept', admin, async (req, res) => {
    if (!req.body.userId) {
        res.status(400);
        return;
    }
    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1', [req.body.userId]);
        if (!userRow.rows[0]) {
            res.status(400);
            return;
        } else if (!userRow.rows[0].accepted) {
            res.status(200).json({accepted: false});
            return;
        } else {
            res.status(200).json({accepted: true});
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(400);
        return;
    }
})

module.exports = router;