// Some settings
const victims = 40;
const hunters = 10;


const Api = require('./Api');
const Bot = require('./Bot');
const Config = require('../config');
const WebSocket = require('ws');

const { SPEED } = Config;

let botNumber = 0;
let players = [];
let Bots = [];

/*
 * hunter is a Strategy configurable for each Bot.
 * As such it will be re-evaluated on each Server response.
 *
 * See Bot.js.
 */
function hunter() {
    const bot = this;
    const { position } = bot;

    const victims = players
        .map(player => {
            if (!position) {
                return;
            }
            const distance = Math.abs(position.x - player.position.x) + Math.abs(position.y - player.position.y);
            return { distance, ...player };
        })
        .sort((a, b) => a.distance - b.distance);

    const victim = victims[0] && victims[0].name !== bot.name ? victims[0] : victims[1];

    if (!victim) {
        return;
    }

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


function populate(max, type) {
    let i = 0;

    function createBot() {
        i++;

        setTimeout(function() {
            let bot = {};

            if (!type) {
                bot = new Bot(`Woelfchen ${i}`, hunter);
            } else {
                bot = new Bot(`Opfer ${i}`, () => {});
            }

            bot.connect();
            Bots.push(bot);

            console.log('Bot created');

            if (i < max) {
                createBot();
            }

        }, SPEED);
    }

    createBot();
}

function start() {

    populate(hunters, 0); // Hunters
    populate(victims, 1); // Victims

    const webSocket = new WebSocket('ws://localhost:3001/');
    webSocket.onmessage = event => {
        data = JSON.parse(event.data);
        players = data.players;

        Bots.forEach(bot => {
            if (bot.id) {
                bot.strategy();
            }
        });
    };
}


module.exports = start;
