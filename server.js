const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });
require('colors').config({ path: path.join(__dirname, 'colors.js') });
const express = require('express');
const app = express();

app.use(express.json());

https.createServer({}, app).listen(process.env.PORT, console.log(`Server listening on port ${process.env.port}`.success));
