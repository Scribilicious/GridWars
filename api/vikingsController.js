'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Viking = require('./Viking');
const Action = require('./Action');
const Config = require('./Config');

const mapSizeX = Config.MAP_SIZE_X;
const mapSizeY = Config.MAP_SIZE_Y;

const vikingsList = [];

let findVikingById = function(id) {
    let viking = null;

    vikingsList.forEach(function(v) {
        if (v.id === id) {
            viking = v;
        }
    });

    return viking;
};

let findVikingByPosition = function(position) {
    let viking = null;

    vikingsList.forEach(function(v) {
        if (v.position.x === position.x && v.position.y === position.y) {
            viking = v;
        }
    });

    return viking;
};

let findVikingsByOrder = function(order) {
    let vikings = [];

    vikingsList.forEach(function(v) {
        if (v.action.order === order) {
            vikings.push(v);
        }
    });

    return vikings;
};

let parseVikings = function() {
    let parsedVikings = [];

    vikingsList.forEach(function(v) {
        parsedVikings.push(v.parse());
    });

    return parsedVikings;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

router.post('/', function(req, res) {
    let viking = new Viking();

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

    let sendWithId = true;
    res.json(viking.parse(sendWithId));

    io.sockets.emit('vikingsUpdate', { vikings: parseVikings() });
});

router.put('/', function(req, res) {
    let viking = findVikingById(req.body.id);

    if (!viking) {
        res.status(400).json({ error: 'deadViking' });
        return;
    }

    viking.action = req.body.action;

    res.json(viking.parse());
});

router.get('/', function(req, res) {
    console.log('getting vikings');

    res.json({ vikings: parseVikings() });
});

let handleVikingAttack = function(viking) {
    try {
        let attackPosition = viking.getActionPosition();

        let otherViking = findVikingByPosition(attackPosition);

        if (otherViking) {
            otherViking.health -= viking.level;

            if (otherViking.isDead()) {
                viking.kills += 1;
            }
        }
    } catch (e) {
        console.log(e);
    }
};

let handleVikingMove = function(viking) {
    try {
        let movePosition = viking.getActionPosition();

        let otherViking = findVikingByPosition(movePosition);

        if (otherViking) {
            throw new Error(viking.id + ' something is in my way');
        }

        viking.position = movePosition;
    } catch (e) {
        console.log(e);
    }
};

let handleVikingHeal = function(viking) {
    try {
        viking.increaseHitPoints(viking.level);
    } catch (e) {
        console.log(e);
    }
};

let disposeBodies = function() {
    let i = vikingsList.length;

    while (i--) {
        let viking = vikingsList[i];

        if (viking.isDead()) {
            vikingsList.splice(i, 1);
        }
    }
};

let resetVikingsOrders = function() {
    vikingsList.forEach(function(viking) {
        viking.action.order = Action.ORDER_STOP;
    });
};

let levelUpVikings = function() {
    vikingsList.forEach(function(viking) {
        viking.checkForLevelUp();
    });
};

let gameRound = 1;

let gameUpdate = function() {
    console.log('Game round ' + gameRound++);

    let vikings = findVikingsByOrder(Action.ORDER_ATTACK);

    vikings.forEach(function(viking) {
        handleVikingAttack(viking);
    });

    disposeBodies();

    levelUpVikings();

    vikings = findVikingsByOrder(Action.ORDER_MOVE);

    vikings.forEach(function(viking) {
        handleVikingMove(viking);
    });

    vikings = findVikingsByOrder(Action.ORDER_HEAL);

    vikings.forEach(function(viking) {
        handleVikingHeal(viking);
    });

    resetVikingsOrders();

    io.sockets.emit('vikingsUpdate', { vikings: parseVikings() });
};

let gameInterval = setInterval(gameUpdate, 100);

module.exports = router;
