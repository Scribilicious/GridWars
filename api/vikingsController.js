const express = require('express');

const app = express();
const router = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Viking = require('./Viking');
const Action = require('./Action');
const Config = require('../config');

const mapSizeX = Config.MAP_SIZE_X;
const mapSizeY = Config.MAP_SIZE_Y;
const speed = Config.SPEED;

const vikingsList = [];

function findVikingById(id) {
    let viking = null;

    vikingsList.forEach(v => {
        if (v.id === id) {
            viking = v;
        }
    });

    return viking;
}

function findVikingByPosition(position) {
    let viking = null;

    vikingsList.forEach(v => {
        if (v.position.x === position.x && v.position.y === position.y) {
            viking = v;
        }
    });

    return viking;
}

function findVikingsByOrder(order) {
    const vikings = [];

    vikingsList.forEach(v => {
        if (v.action.order === order) {
            vikings.push(v);
        }
    });

    return vikings;
}

function parseVikings() {
    const parsedVikings = [];

    vikingsList.forEach(v => {
        parsedVikings.push(v.parse());
    });

    return parsedVikings;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

router.post('/', (req, res) => {
    const viking = new Viking();

    let maxTries = 10;
    let position = {
        x: getRandomInt(0, mapSizeX),
        y: getRandomInt(0, mapSizeY),
    };

    while (findVikingByPosition(position) && maxTries--) {
        position = {
            x: getRandomInt(0, mapSizeX),
            y: getRandomInt(0, mapSizeY),
        };
    }

    if (maxTries === 0) {
        res.json({
            error: 'could not find empty spot for you viking, please try again',
        });
        return;
    }

    viking.position = position;

    viking.name = req.body.name;

    vikingsList.push(viking);

    const sendWithId = true;
    res.json(viking.parse(sendWithId));

    io.sockets.emit('vikingsUpdate', { vikings: parseVikings() });
});

router.put('/', (req, res) => {
    const viking = findVikingById(req.body.id);

    if (!viking) {
        res.status(400).json({ error: 'deadViking' });
        return;
    }

    viking.action = req.body.action;

    res.json(viking.parse());
});

router.get('/', (req, res) => {
    console.log('getting vikings');

    res.json({ vikings: parseVikings() });
});

function handleVikingAttack(viking) {
    try {
        const attackPosition = viking.getActionPosition();

        const otherViking = findVikingByPosition(attackPosition);

        if (otherViking) {
            otherViking.health -= viking.level;

            if (otherViking.isDead()) {
                viking.kills += 1;
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function handleVikingMove(viking) {
    try {
        const movePosition = viking.getActionPosition();

        const otherViking = findVikingByPosition(movePosition);

        if (otherViking) {
            throw new Error(`${viking.id} something is in my way`);
        }

        viking.position = movePosition;
    } catch (e) {
        console.log(e);
    }
}

function handleVikingHeal(viking) {
    try {
        viking.increaseHitPoints(viking.level);
    } catch (e) {
        console.log(e);
    }
}

function disposeBodies() {
    let i = vikingsList.length;

    while (i--) {
        const viking = vikingsList[i];

        if (viking.isDead()) {
            vikingsList.splice(i, 1);
        }
    }
}

function resetVikingsOrders() {
    vikingsList.forEach(viking => {
        viking.action.order = Action.ORDER_STOP;
    });
}

function levelUpVikings() {
    vikingsList.forEach(viking => {
        viking.checkForLevelUp();
    });
}

let gameRound = 1;

function gameUpdate() {
    gameRound += 1;
    console.log(`Game round ${gameRound}`);

    let vikings = findVikingsByOrder(Action.ORDER_ATTACK);

    vikings.forEach(viking => {
        handleVikingAttack(viking);
    });

    disposeBodies();

    levelUpVikings();

    vikings = findVikingsByOrder(Action.ORDER_MOVE);

    vikings.forEach(viking => {
        handleVikingMove(viking);
    });

    vikings = findVikingsByOrder(Action.ORDER_HEAL);

    vikings.forEach(viking => {
        handleVikingHeal(viking);
    });

    resetVikingsOrders();

    io.sockets.emit('vikingsUpdate', { vikings: parseVikings() });
}

setInterval(gameUpdate, speed);

module.exports = router;
