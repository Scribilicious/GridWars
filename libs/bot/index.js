const Api = require('./Api');
const Bot = require('./Bot');
const Config = require('../config');

const MAXBOTS = 20;
const { SPEED } = Config;

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
 * hunter is a Strategy configurable for each Bot.
 * As such it will be re-evaluated on each Server response.
 *
 * See Bot.js.
 */
function hunter() {
    const bot = this;
    const { position } = bot;
    // target next player in line (players is sorted by entry)
    const victims = players
        .map(player => {
            const distance = Math.abs(position.x - player.position.x) + Math.abs(position.y - player.position.y);
            return { distance, ...player };
        })
        .sort((a, b) => a.distance - b.distance);

    const victim = victims[0] && victims[0].name !== bot.name ? victims[0] : victims[1];

    // while no other Player on the Board, heal and keep the re-evaluation cycle alive
    if (victim.distance > 2 && bot.health < bot.level * 2 && bot.level > 1) {
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


function populate() {
    botNumber++;

    setTimeout(function() {
        const Wolf = new Bot(`Woelfchen${botNumber}`, hunter);
        const Wolf2 = new Bot(`Woelfchen${botNumber}`, hunter);
        const Opfer = new Bot(`Opfer${botNumber}`, () => {});
        console.log('Bot created');
        Wolf2.connect();
        Wolf.connect();
        Opfer.connect();

        if (botNumber < MAXBOTS) {
            populate();
        }

    }, SPEED);
}


module.exports = populate;
