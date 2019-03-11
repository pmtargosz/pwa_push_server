const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('../config');
const push = require('./push');

// App
const app = express();

// Helmet 
app.use(helmet());

// Baisic Middlewares:
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Cors
app.use(cors({
    origin: `http://localhost:${config.CLIENT_PORT}`,
    optionsSuccessStatus: 200
}));

// Routes
app.post('/api/subscribe', (req, res, next) => {
    push.addSubscription(req.body);
    res.json({
        subscription: req.body
    });
});

app.post('/api/push', (req, res, next) => {
    push.send(req.body.message.toString());

    res.json({
        message: 'Push Notification send!'
    });
});

// Public Key
app.get('/api/key', (req, res, next) => {
    // Get vapid public key from push module
    const key = push.getKey();

    // Respond with public key
    res.json({
        key
    });
});

app.use('*', (req, res, next) => {
    res.status(404);
    res.json({
        error: '404 - Page not found!'
    });
});


// Server settings
const server = http.createServer(app);
server.listen(config.SERVER_PORT);
console.log(`The server is listening on port ${config.SERVER_PORT} http://localhost:${config.SERVER_PORT}`);