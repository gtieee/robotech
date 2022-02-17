const express = require('express');
var router = express.Router();

const db = require('../db');

router.get('/', async (req, res) => {
    const data = await db.query("SELECT * FROM data.users;");
    res.send(data.rows);
})

router.get('/check', async (req, res) => {
    try {
        const user = req.query.user;
        const found = await db.query("SELECT * FROM data.users WHERE email = $1", [user]);
        console.log(found.rows[0].pass);
        res.status(200).send('Found this user');
    } catch (err) {
        console.log(err);
        res.status(400).send("Could not find this user in the database");
    }
})

module.exports = router;