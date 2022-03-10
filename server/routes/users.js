const express = require('express');
const auth = require('../middleware/auth.js');
const admin = require('../middleware/admin.js');
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

    var data = {registered: 0, applied: 0};

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
    try {
        await db.query('UPDATE users SET accepted = true WHERE id = $1', [req.body.userId]);
        res.status(200);
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