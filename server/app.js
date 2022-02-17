const express = require('express');
const path = require('path');
const utils = require('./utils/hash');
const cors = require('cors');
const mountRoutes = require('./routes');
require ('dotenv').config();

var app = express();
mountRoutes(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());


//in development mode, node will serve static front-end files
if (process.env.NODE_ENV == 'development') {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/register.html'));
    });
}

app.listen(500);