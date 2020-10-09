'use strict';

const express = require('express');
const api = express.Router();

api.use('/controller', require('./PlayersController'));

api.get('/', (req, res) => {
    res.json({ message: 'It works!' });
});

module.exports = api;
