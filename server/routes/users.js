const express = require('express');
const auth = require('../middleware/auth.js');
var router = express.Router();

const db = require('../db');

router.get('/', auth, async (req, res) => {
    const data = await db.query("SELECT * FROM users;");
    res.send(data.rows);
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