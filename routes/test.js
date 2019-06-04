const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ error: 'name rquired (no-name)' });
    }
    res.json({ status: `Viking "${name}" spawned.` });
});

router.put('/', (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json({ error: 'id rquired (no-id)' });
    }
    res.json({ status: `Viking ${id} updated.` });
});

router.get('/', (req, res) => {
    const vikings = [{ id: 'aa123', position: { x: 15, y: 24 } }, { id: 'bb456', position: { x: 5, y: 9 } }];

    res.json({ vikings });
});

module.exports = router;
