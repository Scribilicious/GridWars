const express = require('express');

const app = express();
const router = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Game = require('./Game');
const gameUpdate = require('./ClassicMode');
const gameCofiguration = require('./Config');

const Level = new Game(gameCofiguration, gameUpdate);

router.post('/', (req, res) => {
    const { name } = req.body;
    const newPlayer = Level.spawnViking(name);

    if (!newPlayer) {
        res.status(400).json({ error: 'no empty spot, please try again' });
        return;
    }

    res.json(newPlayer);
    io.sockets.emit('vikingsUpdate', { vikings: Level.parseVikings() });
});

router.put('/', (req, res) => {
    const { id } = req.body;
    const viking = Level.findVikingById(id);

    if (!viking) {
        res.status(400).json({ error: 'deadViking' });
        return;
    }

    viking.action = req.body.action;

    res.json(viking.parse());
});

router.get('/', (req, res) => {
    const vikings = Level.parseVikings();

    res.json({ vikings });
});

module.exports = router;
