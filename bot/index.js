const Api = require('./Api');
const Bot = require('./Bot');

const SPEED = 10 * 1000;

let botNumber = 0;
let players = [];

function updatePlayers() {
    setTimeout(function() {
        Api.call()
            .then(data => {
                players = data.vikings;
            })
            .then(() => updatePlayers())
            .catch(error => console.error(error));
    }, SPEED / 2);
}
updatePlayers();

/*
 * hunter is a Strategy.
 * As such it will be re-evaluated on each Server response.
 *
 * See Bot.js.
 */
function hunter() {
    const bot = this;

    // target next player in line (players is sorted by entry)
    const victim =
        players[0] && players[0].name !== bot.name ? players[0] : players[1];

    // while no other Player on the Board, heal and keep the re-evaluation cycle alive
    if (!victim) {
        return bot.heal();
    }

    // get information about the next target and range
    const nextStep = bot.moveInRange(victim);

    // handle invalid target, might be caused by async/lag
    if (nextStep.x === 0 && nextStep.y === 0) {
        return bot.health < 2 ? bot.heal() : bot.stop();
    }

    // distance to target is <= 1, so we are in range to attack
    if (nextStep.inRange) {
        return bot.attack(nextStep);
    }

    // otherwise move towards target
    return bot.move(nextStep);
}

function populate() {
    botNumber++;

    const Wolf = new Bot('Woelfchen' + botNumber, hunter);
    Wolf.connect();
}

setInterval(populate, SPEED);
