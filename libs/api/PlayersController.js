const express = require('express');

const app = express();
const router = express.Router();
const http = require('http').Server(app);
const WebSocket = require('ws');

const Player = require('./Player');
const Action = require('./Action');
const Config = require('../config');

const obstacles = new require('../classes/Obstacles.js')(Config);

const mapSizeX = Config.MAP_SIZE_X;
const mapSizeY = Config.MAP_SIZE_Y;
const speed = Config.SPEED;

const playersList = [];

const wss = new WebSocket.Server({ port: 3001 });

const broadcastResult = players => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    players,
                    map: { width : mapSizeX, height : mapSizeY, speed, obstacles : obstacles.map },
                })
            );
        }
    });
};

const findPlayerById = id => playersList.find(v => v.id === id);
const findPlayerByName = name => playersList.find(v => v.name === name);
const findPlayerByPosition = position =>
    playersList.find(
        v => v.position.x === position.x && v.position.y === position.y
    );

const findPlayersByOrder = function(order) {
    const players = [];

    playersList.forEach(function(v) {
        if (v.action.order === order) {
            players.push(v);
        }
    });

    return players;
};

const parsePlayers = function() {
    const parsedPlayers = [];

    playersList.forEach(function(v) {
        parsedPlayers.push(v.parse());
    });

    return parsedPlayers;
};

const getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

const isPositionAvailable = function(position) {
    return (
        !obstacles.checkPosition(position, 0) && !findPlayerByPosition(position)
    );
};

router.post('/', function(req, res) {
    const { name } = req.body;

    if (!name) {
        res.json({ error: 'please provide a name' });
        return;
    }

    if (findPlayerByName(name)) {
        res.json({ error: `a player with name ${name} already exists` });
        return;
    }

    const player = new Player();

    let maxTries = 10;
    let position = {
        x: getRandomInt(0, mapSizeX),
        y: getRandomInt(0, mapSizeY),
    };

    while (!isPositionAvailable(position) && maxTries--) {
        position = {
            x: getRandomInt(0, mapSizeX - 1),
            y: getRandomInt(0, mapSizeY - 1),
        };
    }

    if (maxTries === 0) {
        res.json({
            error: 'could not find empty spot for you player, please try again',
        });
        return;
    }

    player.position = position;
    player.name = req.body.name;
    player.color = req.body.color || ((Math.random() * 0xffffff) << 0).toString(16);
    player.animationDelay = getRandomInt(1, 6);

    playersList.push(player);

    const sendWithId = true;
    res.json(player.parse(sendWithId));

    broadcastResult(parsePlayers());
});

router.put('/', function(req, res) {
    const player = findPlayerById(req.body.id);

    if (!player) {
        res.status(400).json({ error: 'deadPlayer' });
        return;
    }

    player.action = req.body.action;

    res.json(player.parse());
});

router.get('/', function(req, res) {
    console.log('getting players');

    res.json({
        players: parsePlayers(),
        map: { width : mapSizeX, height : mapSizeY, speed, obstacles : obstacles.map },
    });
});

const handlePlayerAttack = function(player) {
    try {
        const attackPosition = player.getActionPosition();

        const otherPlayer = findPlayerByPosition(attackPosition);

        if (otherPlayer) {
            otherPlayer.health -= player.level;
            //otherPlayer.health -= Math.ceil(player.level / 2); // TODO find good damage value
            //otherPlayer.health -= 1;

            if (otherPlayer.isDead()) {
                player.kills += 1;
            }
        }
    } catch (e) {
        console.log(e);
    }
};

const handlePlayerDestroy = function(player) {
    try {
        player.health = 0;
    } catch (e) {
        console.log(e);
    }
}

const handlePlayerMove = function(player) {
    try {
        const movePosition = player.getActionPosition();

        if (obstacles.checkPositionDamage(movePosition)) {
            player.health--;
            console.log(`${player.name} is taking damage of obstacle`);

        } else if (!isPositionAvailable(movePosition)) {
            //throw new Error(`${player.id} something is in my way`);
            console.log(`${player.name} something is in my way`);
            return;
        }

        player.position = movePosition;
    } catch (e) {
        console.log(e);
    }
};

const handlePlayerHeal = function(player) {
    try {
        //player.increaseHitPoints(player.level);
        player.increaseHitPoints(1);
    } catch (e) {
        console.log(e);
    }
};

const disposeBodies = function() {
    let i = playersList.length;

    while (i--) {
        const player = playersList[i];

        if (player.isDead()) {
            playersList.splice(i, 1);
        }
    }
};

const resetPlayersOrders = function() {
    playersList.forEach(function(player) {
        player.action.order = Action.ORDER_STOP;
    });
};

const levelUpPlayers = function() {
    playersList.forEach(function(player) {
        player.checkForLevelUp();
    });
};

let gameRound = 1;

const gameUpdate = function() {
    console.log(`Game round ${gameRound++}`);

    if (playersList.length) {
        handlePlayerActions(Action.ORDER_ATTACK);
        handlePlayerActions(Action.ORDER_DESTROY);

        disposeBodies();

        levelUpPlayers();

        handlePlayerActions(Action.ORDER_MOVE);
        handlePlayerActions(Action.ORDER_HEAL);

        resetPlayersOrders();
    }

    broadcastResult(parsePlayers());
};

const handlePlayerActions = function(action) {
    const players = findPlayersByOrder(action);
    let event;

    if (!players.length) {
        return;
    }

    switch (action) {
        case 'move':
            event = function(player) {
                handlePlayerMove(player);
            };
            break;

        case 'attack':
            event = function(player) {
                handlePlayerAttack(player);
            };
            break;

        case 'destroy':
            event = function(player) {
                handlePlayerDestroy(player);
            };
            break;

        case 'heal':
            event = function(player) {
                handlePlayerHeal(player);
            };
            break;
    }

    if (!event) {
        return;
    }

    console.log('Doing the action : ', action);

    players.forEach(function(player) {
        event(player);
    });
};

const gameInterval = setInterval(gameUpdate, speed);

module.exports = router;
