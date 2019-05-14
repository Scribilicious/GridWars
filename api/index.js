"use strict";

const express = require("express");
const api = express.Router();

api.use("/vikings", require("./vikings.js"));

api.get("/", (req, res) => {
    res.json({ message: "It works!" });
});

module.exports = api;
