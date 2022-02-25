const express = require('express');
const bcrypt = require('bcrypt');
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

router.get('/users', async (req, res) => {
    const data = await db.query("SELECT * FROM users;");
    res.send(data.rows);
})

router.post('/update', async (req, res) => {
    const email = req.email;
    const oldPass = oldPass;
})

module.exports = router;