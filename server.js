const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });
require('colors').setTheme(require('./colors'));
const express = require('express');
const app = express();

const router = require('./util/router');
app.use('/', router);
app.use(express.json());

app.listen(process.env.PORT, console.log(`Server listening on port ${process.env.PORT}`.success));
