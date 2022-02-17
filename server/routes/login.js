const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var router = express.Router();
router.use(express.json());

const db = require('../db');


router.post('/', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;

    if (!(email && pass)) {
        res.status(400).send('Email and password data must be sent to this endpoint');
    }

    var userData = {};

    try {
        userData = await db.query("SELECT * FROM data.users WHERE email = $1", [email]);
    } catch (err) {
        console.log(err);
        res.status(400).send('Incorrect login information');
    }

    if (!userData) {
        res.status(400).send('Incorrect login information');
    }
    
    bcrypt.compare(pass, userData.rows[0].pass, (err, result) => {
        try {
            const token = jwt.sign({user_id: email}, process.env.TOKEN_KEY, {expiresIn: '2h'});
            res.status(200).json(token);
        } catch (err) {
            console.log(err);
            res.status(400).send('Failed to log in');
        }
    })

})

module.exports = router;