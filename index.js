"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", require("./api"));

app.listen(port, () => console.log(`Listening on port ${port}`));
io.on("connection", () => console.log("a user connected"));
