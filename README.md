# robotech
A Hackathon management system for RoboTech, GT IEEE's robotics hackathon

## Dependencies
We use AWS S3 for storing applicant's resumes and AWS SES for sending emails asynchronously

## Local Setup
### Server
Install dependencies
```bash
cd server
npm install
```
Run server
```bash
node server.js
```
Or run server that updates with changes
```bash
nodemon server.js
```

### Client
Install dependencies
```bash
cd client
npm install
```
Run local client server
```bash
npm run start
```


