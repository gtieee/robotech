const express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const questions = require('../questions.json');

router.get('/participant', auth, (req, res) => {
    res.send(questions.participant);
})

module.exports = router;