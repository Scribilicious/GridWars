const shortid = require('shortid');
const Action = require('./Action');
const Config = require('./Config');

const mapSizeX = Config.MAP_SIZE_X;
const mapSizeY = Config.MAP_SIZE_Y;

class Viking {
    constructor() {
        this.id = shortid.generate();
        this.name = 'Bob';
        this.level = 1;
        this.health = 2;
        this.kills = 0;
        this.action = { order: Action.ORDER_STOP };
        this.position = { x: 0, y: 0 };
    }

    parse(withId) {
        const vikingJSON = {
            name: this.name,
            level: this.level,
            health: this.health,
            kills: this.kills,
            action: this.action,
            position: this.position,
        };
        if (withId) {
            vikingJSON.id = this.id;
        }
        return vikingJSON;
    }

    getActionPosition() {
        const position = {};
        const p = this.action.position;
        if (p.x >= -1 && p.x <= 1 && p.y >= -1 && p.y <= 1) {
            position.x = this.position.x + p.x;
            position.y = this.position.y + p.y;
            position.x = position.x < 0 ? 0 : position.x > mapSizeX ? mapSizeX : position.x;
            position.y = position.y < 0 ? 0 : position.y > mapSizeY ? mapSizeY : position.y;
        } else {
            throw new Error(`${this.id} position of order is invalid`);
        }
        return position;
    }

    checkForLevelUp() {
        if (this.kills > 2 ** (this.level - 1)) {
            this.level += 1;
            this.kills = 0;
            this.increaseHitPoints(2);
        }
    }

    increaseHitPoints(healthToAdd) {
        this.health += healthToAdd;
        if (this.health > this.level * 2) {
            this.health = this.level * 2;
        }
    }

    isDead() {
        return this.health <= 0;
    }
}

module.exports = Viking;
