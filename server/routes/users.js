const express = require('express');
const auth = require('../middleware/auth.js');
var router = express.Router();

const db = require('../db');
const { RowDescriptionMessage } = require('pg-protocol/dist/messages');

router.get('/', auth, async (req, res) => {
    const data = await db.query("SELECT * FROM users;");
    res.send(data.rows);
})

router.get('/stats', async (req, res) => {
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

module.exports = router;