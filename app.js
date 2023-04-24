const express = require('express');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });
const PORT = process.env.PORT || 3000;
const app = express();

collectDefaultMetrics();

app.get('/', function (req, res) {
    res.send('Yellow world!')
});

app.get('/check', function (req, res) {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    }

    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
});

app.get('/metrics', function (req, res) {
    res.setHeader('Content-Type', register.contentType);
    register.metrics().then(data => res.status(200).send(data));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});