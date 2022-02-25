const express = require('express');
const auth = require('../middleware/auth.js');
var router = express.Router();
const db = require('../db');

router.post('/info', auth, async (req, res) => {
    var userRow = {}
    
})

module.exports = router;