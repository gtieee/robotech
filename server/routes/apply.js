const express = require('express');
const auth = require('../middleware/auth.js');
const crypto = require('crypto');
var router = express.Router();
const db = require('../db');

router.post('/info', auth, async (req, res) => {
    try {
        if (!req.body.userId) {
            res.status(400).json({submitted: false});
            return;
        }
        
        const uuid = crypto.randomUUID();
        const writeQuery = 'INSERT INTO applications (id, age, school, dietary, design, mechanical, electrical, software, skills, interest)' +
                    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);';
        const updateQuery = 'UPDATE users SET apply_id = $1 WHERE id = $2';
        var school = (req.body.school == 'other') ? req.body.other : req.body.school;
        const params = [uuid, req.body.age, req.body.school, req.body.dietary, req.body.design, req.body.mech, req.body.elec, req.body.soft, req.body.skills, req.body.interest];
        await db.query(updateQuery, [uuid, req.body.userId]);
        await db.query(writeQuery, params)
        res.status(200).json({submitted: true});
    } catch(err) {
        console.log(err);
        res.status(400).json({submitted: false});
    }
    
})

module.exports = router;