

const express = require('express');
const auth = require('../middleware/auth.js');
var router = express.Router();
const db = require('../db');

router.post('/', auth, async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM events ORDER BY time_order ASC;');
        return res.status(200).send(response.rows);
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})


module.exports = router;