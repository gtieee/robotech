const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var router = express.Router();
const db = require('../db');

/**
 * @route / - Logs a user in by sending them an auth token and their user id for future requests
 * @security - None
 * @request - email: string, pass: string
 * @response - id: string, token: string, user: string, message: string
 */
router.post('/', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;

    if (!(email && pass)) {
        res.status(400).json({id: null, token: null, user: null, message: 'Email and password data must be sent to this endpoint'});
        return;
    }

    var userData = {};

    try {
        userData = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (!userData.rows[0]) {
            res.status(401).json({id: null, token: null, user: null, message: 'Incorrect login information'});
            return
        }
        if (!userData.rows[0].pass) {
            res.status(401).json({id: null, token: null, user: null, message: 'Incorrect login information'});
            return
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({id: null, token: null, user: null});
        return;
    }

    bcrypt.compare(pass, userData.rows[0].pass, (err, result) => {
        try {
            if (result) {
                const userId = userData.rows[0].id;
                const role = userData.rows[0].role;
                const admin = (role == 1);
                const volunteer = (role == 2);
                const responseToken = jwt.sign({user_id: email}, process.env.TOKEN_KEY, {expiresIn: '2h'});
                res.status(200).json({id: userId, token: responseToken, user: email, admin: admin, volunteer: volunteer, message: 'Logged in'});
            } else {
                res.status(401).json({id: null, token: null, user: null, message: 'Incorrect login information'});
            }
        } catch (err) {
            console.log(err);
            res.status(401).json({id: null, token: null, user: null, message: 'Incorrect login information'});
        }
    })

})

module.exports = router;