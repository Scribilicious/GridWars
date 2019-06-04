const Viking = require('./Viking');
const Action = require('./Action');

class Game {
    constructor(gameConfiguration, gameUpdate) {
        this.mapSizeX = gameConfiguration.mapSizeX;
        this.mapSizeY = gameConfiguration.mapSizeY;
        this.speed = gameConfiguration.speed;

        this.gameUpdate = gameUpdate;
        this.vikings = [];

        setInterval(this.gameUpdate, this.speed);
    }

    spawnViking(name) {
        const viking = new Viking();

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        function getRandomPosition() {
            const position = {
                x: getRandomInt(0, this.mapSizeX),
                y: getRandomInt(0, this.mapSizeY),
            };

            return position;
        }

        let maxTries = 10;
        let position = getRandomPosition();

        // retry assigning a position
        while (this.findVikingByPosition(position) && maxTries--) {
            position = getRandomPosition();
        }

        if (maxTries === 0) {
            return false;
        }

        viking.position = position;
        viking.name = name;

        this.vikings.push(viking);

        return viking.parse(true);
    }

    findVikingById(id) {
        let viking = null;

        this.vikings.forEach(v => {
            if (v.id === id) {
                viking = v;
            }
        });

        return viking;
    }

    findVikingByPosition(position) {
        let viking = null;

        this.vikings.forEach(v => {
            if (v.position.x === position.x && v.position.y === position.y) {
                viking = v;
            }
        });

        return viking;
    }

    findVikingsByOrder(order) {
        const vikings = [];

        this.vikings.forEach(v => {
            if (v.action.order === order) {
                vikings.push(v);
            }
        });

        return vikings;
    }

    parseVikings() {
        const parsedVikings = [];

        this.vikings.forEach(v => {
            parsedVikings.push(v.parse());
        });

        return parsedVikings;
    }

    disposeBodies() {
        let i = this.vikings.length;

        while (i--) {
            const viking = this.vikings[i];

            if (viking.isDead()) {
                this.vikings.splice(i, 1);
            }
        }
    }

    resetVikingsOrders() {
        this.vikings.forEach(viking => {
            viking.action.order = Action.ORDER_STOP;
        });
    }

    levelUpVikings() {
        this.vikings.forEach(viking => {
            viking.checkForLevelUp();
        });
    }

    emit(event) {
        console.log(`Pfffft. no Events so far - ${event} got ignored`);
    }
}

module.exports = Game;
