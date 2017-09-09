const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/', proxy(process.env.PROXY_URL));

module.exports = app;
