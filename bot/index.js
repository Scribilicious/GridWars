const Api = require('./Api');
const Bot = require('./Bot');

let players = [];
let wolfgamg = 0;

function updatePlayers() {
    Api.call()
        .then(data => {
            players = data.vikings;
        })
        .then(() => {
            updatePlayers();
        })
        .catch(error => console.error(error));
}
updatePlayers();

function chicken() {
    console.log('chicken is sitting around.');
}

function wolfen() {
    const wolf = this;
    const victim =
        players[0] && players[0].name !== wolf.name ? players[0] : players[1];

    // EL MACHETE
    if (victim) {
        const nextStep = wolf.moveInRange(victim);

        if (nextStep.inRange) {
            return wolf.attack(nextStep);
        }
        return wolf.move(nextStep);
    } else {
        console.log('Wölfchen wartet auf opfer.');
        wolfen();
    }
}
var i = 0;
setInterval(function() {
    i = i + 1;
    if (players.length < 10) {
        const Chicken = new Bot('Chicken' + i, chicken);
        Chicken.connect();
    }
}, 2000);

const Woelfchen = new Bot('Woelfchen', wolfen);
setTimeout(function() {
    Woelfchen.connect();
}, 15000);
