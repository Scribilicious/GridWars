const Api = require('./Api');

function Bot(name, strategy) {
    this.id = '';
    this.name = name;

    this.level = 1;
    this.health = 2;
    this.position = { x: 0, y: 0 };

    this.strategy = strategy;
}

Bot.prototype.connect = function() {
    Api.call('POST', { name: this.name })
        .then(data => {
            this.id = data.id;
            this.health = data.health;
            this.level = data.level;
            this.position = data.position;
        })
        .then(() => {
            this.strategy();
        })
        .catch(error => console.error(error));
};
Bot.prototype.order = function(order = 'heal', target = { x: 0, y: 0 }) {
    Api.call('PUT', { id: this.id, action: { order, position: target } })
        .then(data => {
            this.level = data.level;
            this.health = data.health;
            this.position = data.position;

            console.log(data);
        })
        .then(() => {
            this.strategy();
        })
        .catch(error => console.error(error));
};
Bot.prototype.stop = function() {
    this.order('stop');
};
Bot.prototype.heal = function() {
    this.order('heal');
};
Bot.prototype.move = function(step) {
    this.order('move', step);
};
Bot.prototype.attack = function(step) {
    this.order('attack', step);
};
Bot.prototype.moveInRange = function(target) {
    const dx = target.position.x - this.position.x;
    const dy = target.position.y - this.position.y;

    return {
        inRange: Math.sqrt(dx * dx + dy * dy) <= Math.sqrt(2),
        x: dx / Math.abs(dx) || 0,
        y: dy / Math.abs(dy) || 0,
    };
};
Bot.prototype.log = function() {
    console.log(this);
};

module.exports = Bot;
