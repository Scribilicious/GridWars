const Api = require('./Api');
const Bot = require('./Bot');

let players = [];

function updatePlayers() {
    Api.call()
        .then(data => {
            players = data.vikings;
        })
        .then(() => updatePlayers())
        .catch(error => console.error(error));
}
updatePlayers();

function chicken() {
    console.log('chicken is sitting around.');
}

function hunter() {
    const wolf = this;
    const victim =
        players[0] && players[0].name !== wolf.name ? players[0] : players[1];

    if (!victim) {
        return wolf.stop();
    }

    const nextStep = wolf.moveInRange(victim);

    if (nextStep.x === 0 && nextStep.y === 0) {
        return wolf.stop();
    }

    if (nextStep.inRange) {
        return wolf.attack(nextStep);
    }

    return wolf.move(nextStep);
}

const Chicken = new Bot('Chicken', chicken);
Chicken.connect();

const Wolf = new Bot('Woelfchen', hunter);
Wolf.connect();
