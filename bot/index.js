const Bot = require('./Bot');

const Alfred = new Bot('Alfred');
Alfred.connect();

setTimeout(function() {
    Alfred.attack();
}, 2000);

setTimeout(function() {
    Alfred.stop();
}, 10000);

setTimeout(function() {
    Alfred.attack();
}, 15000);

setTimeout(function() {
    Alfred.heal();
}, 20000);

setTimeout(function() {
    Alfred.attack();
}, 25000);
