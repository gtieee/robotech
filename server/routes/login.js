const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;

    if (!(email && pass)) {
        res.status(400).json({token: null, user: null, message: 'Email and password data must be sent to this endpoint'});
    }

    var userData = {};

    try {
        userData = await db.query("SELECT * FROM data.users WHERE email = $1", [email]);
    } catch (err) {
        console.log(err);
        res.status(400).json({token: null, user: null});
    }

    if (!userData) {
        res.status(400).json({token: null, user: null, message: 'Incorrect login information'});
    }
    
    bcrypt.compare(pass, userData.rows[0].pass, (err, result) => {
        try {
            const responseToken = jwt.sign({user_id: email}, process.env.TOKEN_KEY, {expiresIn: '2h'});
            res.status(200).json({token: responseToken, user: email, message: 'Logged in'});
        } catch (err) {
            console.log(err);
            res.status(400).json({token: null, user: null, message: 'Incorrect login information'});
        }
    })

})

module.exports = router;