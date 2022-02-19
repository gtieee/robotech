const express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
const db = require('../db');

//need to implement other routes here

//this will likely need to be changed to send data in a more palatable format
//also will need to be authenticated
router.post('/new', async (req, res) => {
    email = req.body.email;
    pass = req.body.pass;
    first = req.body.first;
    last = req.body.last

    if (!(email && pass && first && last)) {
        res.status(400).send("All data must be sent to this endpoint");
    }

    bcrypt.hash(pass, 10, async (err, hash) => {
        try {
            await db.query("INSERT INTO data.users (first_name, last_name, email, pass) VALUES ($1, $2, $3, $4)", [
                first, last, email, hash])
                res.status(201).send('User created');
        } catch (err) {
            console.log(err);
            res.status(400).send('Failed to create user');
        }      
    })
})

router.get('/users', async (req, res) => {
    const data = await db.query("SELECT * FROM data.users;");
    res.send(data.rows);
})

router.post('/update', async (req, res) => {
    const email = req.email;
    const oldPass = oldPass;
})

module.exports = router;