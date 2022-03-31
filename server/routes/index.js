const register = require('./register.js');
const questions = require('./questions.js');
const users = require('./users.js');
const login = require('./login.js');
const apply = require('./apply.js');
const submissions = require('./submissions.js');
const events = require('./events.js')

module.exports = app => {
    app.use('/api/register', register);
    app.use('/api/login', login);
    app.use('/api/questions', questions);
    app.use('/api/users', users);
    app.use('/api/apply', apply);
    app.use('/api/submissions', submissions);
    app.use('/api/events', events);
    //include other routes here
}