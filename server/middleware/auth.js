const jwt = require('jsonwebtoken');


function auth(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

    if (!token) {
        res.status(401).send('Unauthorized');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {
        res.status(401).send('Unauthorized');
    }

    next();
}

module.exports = auth;