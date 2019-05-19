const Bot = require('./Bot');

const Alfred = new Bot('Alfred');
Alfred.connect();

setInterval(function() {
    Alfred.attack();
}, 1000);
