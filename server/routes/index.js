const register = require('./register.js');
const questions = require('./questions.js');
const users = require('./users.js');
const login = require('./login.js');

module.exports = app => {
    app.use('/register', register);
    app.use('/login', login);
    app.use('/questions', questions);
    app.use('/users', users);
    //include other routes here
}