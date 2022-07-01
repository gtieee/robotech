// The logic in this file is not currently used - will probably be replaced with a better system

const express = require('express');
const admin = require('../middleware/admin.js');
const fs = require('fs');
const csv = require('csv-parse');
var router = express.Router();

const db = require('../db');

router.post('/update', admin, async (req, res) => {
    try {
        await db.query('DELETE FROM projects');
    } catch (err) {
        console.log(err);
        return res.status(500).send({success: false});
    }

    fs.readFile('submissions/submissions.csv', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send({success: false});
        }
        csv.parse(data.toString(), {columns: true}, (err, records) => {
            if (err) {
                console.log(err);
                return res.status(500).send({success: false});
            }
            records.forEach(async (record) => {
                const design = (record.design === 'yes' || record.design === 'true');
                const body = (record.body === 'yes' || record.body === 'true');
                const electrical = (record.electrical === 'yes' || record.electrical === 'true');
                const software = (record.software === 'yes' || record.software === 'true');
                try {
                    await db.query('INSERT INTO projects (project, url, design, body, electrical, software) VALUES ($1, $2, $3, $4, $5, $6);', [record.project, record.URL, design, body, electrical, software]);
                } catch (err) {
                    console.log(err);
                    return res.status(500).send({success: false});
                }
            })
        })
        return res.status(200).send({success: true});
    })
})

router.post('/get', async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM projects");
        return res.status(200).send(response.rows);
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

module.exports = router;