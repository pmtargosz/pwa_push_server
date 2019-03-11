const path = require('path');
const http = require('http');
const express = require('express');
const config = require('../config');

// App
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// 404 page
app.get('*', (req, res, next) => {
    res.status(404);
    res.sendFile(path.join(__dirname, 'public/404.html'));
});

// Server settings
const server = http.createServer(app);
server.listen(config.CLIENT_PORT);
console.log(`The client is listening on port ${config.CLIENT_PORT} http://localhost:${config.CLIENT_PORT}`);