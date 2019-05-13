'use strict';

const express = require('express');
const app = express();
const api = express.Router();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Home
app.use(express.static('client'));


// API
app.use('/api', api);
app.use(function(err, req, res, next) {
    console.log(err);
});

api.get('/', function (req, res) {
    res.json({message: 'It works!'});
});

api.route('/vikings')
    .get(function (req, res) {
        console.log('getting vikings');
        res.json({vikings: parseVikings()});
    });


// start Server
io.on('connection', function(){
    console.log('a user connected');
});
http.listen(port, function(){
    console.log('listening on '+ port);
});