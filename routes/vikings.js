const express = require('express');

const router = express.Router();

const Game = require('../vikings');
const gameUpdate = require('../vikings/ClassicMode');
const gameCofiguration = require('../vikings/Config');

const Level = new Game(gameCofiguration, gameUpdate);

router.post('/', (req, res) => {
    const { name } = req.body;
    const newPlayer = Level.spawnViking(name);

    if (!newPlayer) {
        res.status(400).json({ error: 'no empty spot, please try again' });
        return;
    }

    res.json(newPlayer);
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
