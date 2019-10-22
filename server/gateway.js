const proxy = require('express-http-proxy');
const express = require('express');
const app = express();
app.use('/api/schedule/', proxy('http://localhost:5000'));
app.use('/api/appointments/', proxy('http://localhost:5001'));
app.use('/api/sms/', proxy('http://localhost:5002'));
app.use('/api/email/', proxy('http://localhost:5003'));
app.listen(8081);
