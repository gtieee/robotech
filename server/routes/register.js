const express = require('express');
var router = express.Router();

const db = require('../db');

module.exports = router;

//need to implement other routes here

//this will likely need to be changed to send data in a more palatable format
//also will need to be authenticated
router.get('/users', async (req, res) => {
    const data = await db.query("SELECT * FROM data.users;");
    res.send(data.rows);
})