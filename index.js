const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
//const botStart = require('./libs/bot/index')

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./libs/api'));

app.listen(port, () => console.log(`Listening on port ${port}`));

//botStart();
