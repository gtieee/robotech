const express = require('express');
const auth = require('../middleware/auth.js');
const admin = require('../middleware/admin.js');
const AWS = require('@aws-sdk/client-ses');
var router = express.Router();

const db = require('../db');
const { RowDescriptionMessage } = require('pg-protocol/dist/messages');

router.post('/', admin, async (req, res) => {
    try {
        const data = await db.query("SELECT users.id, users.email, users.first_name, users.last_name, users.apply_id, users.accepted, users.rejected, applications.school FROM users LEFT JOIN applications ON users.apply_id = applications.id ORDER BY users.last_name;");
        res.status(200).send(data.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error');
    }
    
})

router.post('/stats', admin, async (req, res) => {
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

router.post('/exists', async (req, res) => {
    if (!req.body.email) {
        res.status(400).json({exists: false})
        return;
    }
    try {
        const userRow = await db.query('SELECT * FROM users WHERE email = $1;', [req.body.email]);
        if (userRow.rows[0]) {
            res.status(200).json({exists: true});
        } else {
            res.status(200).json({exists: false});
        }
    } catch (err) {
        console.log(err);
        res.status(200).json({exists: false});
    }
})

router.get('/checkAuth', auth, async (req, res) => {
    res.status(200).send({authed: true});
})

router.post('/checkAdmin', admin, async (req, res) => {
    res.status(200).send({admin: true});
})

router.post('/hasInfo', auth, async (req, res) => {
    if (!req.body.userId) {
        res.status(400).json({hasInfo: false})
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
        res.status(400).send();
        return;
    }
    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1;', [req.body.userId]);
        if (!userRow.rows[0]) {
            res.status(400).send();
            return;
        }
        res.status(200).json({first: userRow.rows[0].first_name, last: userRow.rows[0].last_name});
        return;
    } catch (err) {
        console.log(err)
        res.status(500).send();
        return;
    }
})

router.post('/applyData', admin, async (req, res) => {
    if (!req.body.userId) {
        res.status(400).send();
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
        res.status(500).send();
        return;
    }
})

router.post('/accept', admin, async (req, res) => {
    if (!req.body.userId) {
        res.status(400).send();
        return;
    }

    var userEmail;

    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1', [req.body.userId]);
        if (!userRow.rows[0]) {
            res.status(400).send();
            return;
        }
        userEmail = userRow.rows[0].email;
    } catch (err) {
        console.log(err);
        res.status(400).send();
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
              Data: "<div>Hello,</div>" +
                    "<br><div> We are very pleased to accept you and invite you to the first ever RoboTech. This year, we had immense support with 500+ applicants. We are excited to see what you bring to the table and how you can innovate.</div>"+
                    "<br><div> If you are traveling to Georgia Tech, please fill out this form for travel reimbursement. <a href='https://forms.gle/W1WiEWmiJpwc4bRi7'>Form Here!</a> </div>" + 
                    "<br><div>We will do our best to reimburse you as much as possible. Reimbursements only happen if you submit a project at the hackathon, so we will only reimburse you post the hackathon.</div>" + 
                    "<br><div>We are so very excited that you chose to be a part of RoboTech. We know you will have a great 36 hours where not only will you work on exciting ideas, but also have a great time meeting people and participating in side-events.</div>" + 
                    "<br><div>Please fill out the reimbursement form, if needed, no later than 48 hours post acceptance.</div>" + 
                    "<br><div>Best,</div>" + 
                    "<br><div>GT IEEE.</div>",
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "[UPDATE] RoboTech Decisions",
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
        await db.query('UPDATE users SET accepted = true, rejected = false WHERE id = $1', [req.body.userId]);
        res.status(200).send({success: true});
        return;
    } catch (err) {
        console.log(err);
        res.status(400).send();
        return;
    }
})

router.post('/checkAccept', auth, async (req, res) => {
    if (!req.body.userId) {
        res.status(400).send();
        return;
    }
    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1', [req.body.userId]);
        if (!userRow.rows[0]) {
            res.status(400).send();
            return;
        } else {
            res.status(200).send({accepted: userRow.rows[0].accepted, rejected: userRow.rows[0].rejected});
        }
    } catch (err) {
        console.log(err);
        res.status(400).send();
        return;
    }
})

router.post('/reject', admin, async (req, res) => {
    if (!req.body.userId) {
        res.status(400).send();
        return;
    }

    var userEmail;

    try {
        const userRow = await db.query('SELECT * FROM users WHERE id = $1', [req.body.userId]);
        if (!userRow.rows[0]) {
            res.status(400).send();
            return;
        }
        userEmail = userRow.rows[0].email;
    } catch (err) {
        console.log(err);
        res.status(400).send();
        return;
    }

    try {
        await db.query('UPDATE users SET rejected = true WHERE id = $1', [req.body.userId]);
        res.status(200).send({success: true});
        return;
    } catch (err) {
        console.log(err);
        res.status(500).send();
        return;
    }
})

router.post('/rsvp', auth, async (req, res) => {
    if (!(req.body.in_person || req.body.virtual || req.body.not_attending || req.body.userId)) {
        res.status(400).send();
        return;
    }

    if ((req.body.in_person + req.body.virtual + req.body.not_attending) > 1) {
        res.status(400).send();
        return;
    }

    try {
        await db.query('UPDATE users SET rsvp_in_person = $1, rsvp_virtual = $2, rsvp_not_attending = $3 WHERE id = $4', [req.body.in_person, req.body.virtual, req.body.not_attending, req.body.userId]);
        res.status(200).send({success: true});
        return;
    } catch (err) {
        console.log(err);
        res.status(500).send();
        return;
    }
})

router.post('/getRsvp', auth, async (req, res) => {
    if (!req.body.userId) {
        res.status(400).send();
        return;
    }

    try {
        const response = await db.query('SELECT rsvp_in_person, rsvp_virtual, rsvp_not_attending FROM users WHERE id = $1', [req.body.userId]);
        res.status(200).send({in_person: response.rows[0].rsvp_in_person, virtual: response.rows[0].rsvp_virtual, not_attending: response.rows[0].rsvp_not_attending,})
        return;
    } catch (err) {
        console.log(err);
        res.status(500).send();
        return;
    }
})

module.exports = router;