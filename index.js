const express = require('express');
const router = express.Router();
const port = process.env.PORT || 5000;
const app = express();
const {createProxyMiddleware} = require('http-proxy-middleware');
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/corona-tracker-world-data", limiter, (req, res, next) => {
    createProxyMiddleware({
        target: process.env.BASE_API_URL_CORONA_WORLD,
        changeOrigin: true,
        pathRewrite: {[`^/corona-tracker-world-data`]: "",},
    }) (req, res, next)
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
