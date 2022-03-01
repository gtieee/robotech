const express = require('express');
const auth = require('../middleware/auth.js');
const crypto = require('crypto');
var router = express.Router();
const db = require('../db');
const AWS= require('@aws-sdk/client-s3');

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

router.post('/resume', auth, async (req, res) => {
    if (!req.body.userId || !req.body.first || !req.body.last) {
        res.status(400).json({response: 'Must send user information'});
        return;
    }

    if (!(req.files) || (req.files.file.mimetype != 'application/pdf')) {
        res.status(400).json({response: 'Must send a pdf'});
        return;
    }

    if (req.files.file.size > 20000000) {
        res.status(400).json({response: 'File size must not exceed 20mb'});
        return;
    }

    const uuid = crypto.randomUUID();
    const uploadParams = {
        Bucket: 'robotech-resumes',
        Key: req.body.first + '_' + req.body.last + '_RoboTech_Resume.pdf',
        Body: req.files.file.data,
        ContentType: 'application/pdf'
    }

    const s3 = new AWS.S3Client({region: 'us-east-2'});

    try {
        const res = await s3.send(new AWS.PutObjectCommand(uploadParams));
    } catch (err) {
        console.log(err);
        res.status(500).send({response: 'Failed to upload resume'});
        return;
    }
    try {
        await db.query('UPDATE users SET resume_id = $1 WHERE id = $2', [uuid, req.body.userId]);
    } catch (err) {
        console.log(err);
        res.status(500).send({response: 'Error communicating with database'});
        return;
    }
    res.status(200).send({response: 'Completed'});
})

module.exports = router;