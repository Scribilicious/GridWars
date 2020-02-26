const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const bodyParser = require('body-parser');

const config = require("./libs/config.js");
const obstacles = require("./libs/classes/Obstacles.js")(config);

obstacles.generate();
//console.log(obstacles.map);
//process.exit();

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./libs/api'));

app.listen(port, () => console.log(`Listening on port ${port}`));
