const register = require('./register.js');
const questions = require('./questions.js');

module.exports = app => {
    app.use('/register', register);
    app.use('/questions', questions);
    //include other routes here
}