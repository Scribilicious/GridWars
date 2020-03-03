const express = require('express');

const app = express();
const router = express.Router();
const http = require('http').Server(app);
const WebSocket = require('ws');

const Viking = require('./Viking');
const Action = require('./Action');
const Config = require('../config');

const obstacles = new require('../classes/Obstacles.js')(Config);

const mapSizeX = Config.MAP_SIZE_X;
const mapSizeY = Config.MAP_SIZE_Y;
const speed = Config.SPEED;

const vikingsList = [];

const wss = new WebSocket.Server({ port: 3001 });

const boradcastResult = vikings => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    vikings,
                    mapData: { mapSizeX, mapSizeY, obstacles: obstacles.map },
                })
            );
        }
    });
};

const findVikingById = id => vikingsList.find(v => v.id === id);
const findVikingByName = name => vikingsList.find(v => v.name === name);
const findVikingByPosition = position =>
    vikingsList.find(
        v => v.position.x === position.x && v.position.y === position.y
    );

const findVikingsByOrder = function(order) {
    const vikings = [];

    vikingsList.forEach(function(v) {
        if (v.action.order === order) {
            vikings.push(v);
        }
    });

    return vikings;
};

const parseVikings = function() {
    const parsedVikings = [];

    vikingsList.forEach(function(v) {
        parsedVikings.push(v.parse());
    });

    return parsedVikings;
};

const getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

const isPositionAvailable = function(position) {
    return (
        !obstacles.checkPosition(position) && !findVikingByPosition(position)
    );
};

router.post('/', function(req, res) {
    const { name } = req.body;

    if (!name) {
        res.json({ error: 'please provide a name' });
        return;
    }

    if (findVikingByName(name)) {
        res.json({ error: `a viking with name ${name} already exists` });
        return;
    }

    const viking = new Viking();

    let maxTries = 10;
    let position = {
        x: getRandomInt(0, mapSizeX),
        y: getRandomInt(0, mapSizeY),
    };

    while (!isPositionAvailable(position) && maxTries--) {
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
    viking.color = req.body.color || ((Math.random() * 0xffffff) << 0).toString(16);
    viking.animationDelay = getRandomInt(1, 6);

    vikingsList.push(viking);

    const sendWithId = true;
    res.json(viking.parse(sendWithId));
    boradcastResult(parseVikings());
});

router.put('/', function(req, res) {
    const viking = findVikingById(req.body.id);

    if (!viking) {
        res.status(400).json({ error: 'deadViking' });
        return;
    }

    viking.action = req.body.action;

    res.json(viking.parse());
});

router.get('/', function(req, res) {
    console.log('getting vikings');

    res.json({
        vikings: parseVikings(),
        mapData: { mapSizeX, mapSizeY, obstacles: obstacles.map },
    });
});

const handleVikingAttack = function(viking) {
    try {
        const attackPosition = viking.getActionPosition();

        const otherViking = findVikingByPosition(attackPosition);

        if (otherViking) {
            // otherViking.health -= viking.level; // TODO find good damage value
            otherViking.health -= 1;

            if (otherViking.isDead()) {
                viking.kills += 1;
            }
        }
    } catch (e) {
        console.log(e);
    }
};

const handleVikingMove = function(viking) {
    try {
        const movePosition = viking.getActionPosition();

        if (!isPositionAvailable(movePosition)) {
            throw new Error(`${viking.id} something is in my way`);
        }

        viking.position = movePosition;
    } catch (e) {
        console.log(e);
    }
};

const handleVikingHeal = function(viking) {
    try {
        viking.increaseHitPoints(viking.level);
    } catch (e) {
        console.log(e);
    }
};

const disposeBodies = function() {
    let i = vikingsList.length;

    while (i--) {
        const viking = vikingsList[i];

        if (viking.isDead()) {
            vikingsList.splice(i, 1);
        }
    }
};

const resetVikingsOrders = function() {
    vikingsList.forEach(function(viking) {
        viking.action.order = Action.ORDER_STOP;
    });
};

const levelUpVikings = function() {
    vikingsList.forEach(function(viking) {
        viking.checkForLevelUp();
    });
};

let gameRound = 1;

const gameUpdate = function() {
    console.log(`Game round ${gameRound++}`);

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

    boradcastResult(parseVikings());
};

const gameInterval = setInterval(gameUpdate, speed);

module.exports = router;
