const Api = require('./Api');
const Bot = require('./Bot');
const Config = require('../config');

const { SPEED, MAP_SIZE_X, MAP_SIZE_Y } = Config;

let botNumber = 0;
let players = [];

function updatePlayers() {
    setTimeout(() => {
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
 * hunter is a Strategy configurable for each Bot.
 * As such it will be re-evaluated on each Server response.
 *
 * See Bot.js.
 */
function hunter() {
    const bot = this;

    // target next player in line (players is sorted by entry)
    const victim = players[0] && players[0].name !== bot.name ? players[0] : players[1];

    // while no other Player on the Board, heal and keep the re-evaluation cycle alive
    if (!victim) {
        return bot.heal();
    }

    // get information about the next target and range
    const nextStep = bot.moveInRange(victim);

    // handle invalid target, might be caused by async/lag
    if (nextStep.x === 0 && nextStep.y === 0) {
        return bot.stop();
    }

    // distance to target is <= 1, so we are in range to attack
    if (nextStep.inRange) {
        return bot.attack(nextStep);
    }

    // otherwise move towards target
    if (bot.health < 2) {
        return bot.heal();
    }
    return bot.move(nextStep);
}

const victim = { position: { x: 0, y: 0 } };

function probe() {
    const bot = this;
    const nextStep = bot.moveInRange(victim);

    if (bot.position.x === MAP_SIZE_X && bot.position.y === MAP_SIZE_Y) {
        victim.position.x = 0;
        victim.position.y = 0;
    }

    if (bot.position.x === 0) {
        victim.position.x = MAP_SIZE_X;
    }

    if (bot.position.y === 0) {
        victim.position.y = MAP_SIZE_Y;
    }

    return bot.move(nextStep);
}

function populate() {
    botNumber += 1;

    const Wolf = new Bot(`Woelfchen ${botNumber}`, hunter);
    Wolf.connect();
}

const Probe = new Bot('Probe', probe);
Probe.connect();

setInterval(populate, SPEED);
