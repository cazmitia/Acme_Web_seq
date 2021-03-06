const express = require('express');
const db = require('./db');
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));

db.initDb(true);

