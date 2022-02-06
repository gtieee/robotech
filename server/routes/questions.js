const express = require('express');
var router = express.Router();

const questions = require('../questions.json');

router.get('/participant', (req, res) => {
    res.send(questions.participant);
})

module.exports = router;