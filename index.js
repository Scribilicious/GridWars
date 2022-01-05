const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./libs/api'));

app.listen(port, hostname, () => console.log(`Listening on port ${port}`));

