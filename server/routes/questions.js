const express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

const auth = require('../middleware/auth');
const questions = require('../questions.json');

router.post('/participant', auth, (req, res) => {   
    res.send(questions.participant);
})

module.exports = router;