const jwt = require('jsonwebtoken');
const db = require('../db');


async function admin(req, res, next) {
    const token = req.body.token || req.query.token || req.headers.authorization;

    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY);
        const response = await db.query('SELECT * FROM users WHERE id = $1', [req.body.id]);
        if (response.rows[0].role != 1) {
            res.status(401).send('Unauthorized');
            return;
        } 
    } catch (err) {
        res.status(401).send('Unauthorized');
        return;
    }

    next();
}

module.exports = admin;