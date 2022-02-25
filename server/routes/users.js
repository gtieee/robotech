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

module.exports = router;