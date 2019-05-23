const Api = require('./Api');
const Bot = require('./Bot');

let players = [];

function updatePlayers() {
    setTimeout(function() {
        Api.call()
            .then(data => {
                players = data.vikings;
            })
            .then(() => updatePlayers())
            .catch(error => console.error(error));
    }, 1000);
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

let chickenNumber = 0;
setInterval(function() {
    chickenNumber++;

    const Chicken = new Bot('Chicken' + chickenNumber, chicken);
    Chicken.connect();
}, 10 * 1000);
const Wolf = new Bot('Woelfchen', hunter);
Wolf.connect();
