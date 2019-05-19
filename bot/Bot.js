const Api = require('./Api');

function Bot(name) {
    this.id = '';
    this.name = name;

    this.level = 1;
    this.health = 2;
    this.position = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
}
Bot.prototype.connect = function() {
    Api.call('POST', { name: this.name })
        .then(data => {
            this.id = data.id;
            this.health = data.health;
            this.level = data.level;
            this.position = data.position;
        })
        .catch(error => console.error(error));
};
Bot.prototype.order = function(order = 'heal', target) {
    console.log('current Order:', order);
    const action = { order, position: { x: -1, y: -1 } };

    Api.call('PUT', { id: this.id, action })
        .then(data => {})
        .catch(error => console.error(error));
};
Bot.prototype.heal = function(target) {
    this.order('heal', target);
};
Bot.prototype.attack = function(target) {
    this.order('attack', target);
};
Bot.prototype.stop = function(target) {
    this.order('stop', target);
};
Bot.prototype.log = function() {
    console.log(this);
};

module.exports = Bot;
