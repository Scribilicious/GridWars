'use strict';

const shortid = require('shortid');
const Action = require('./Action');
const Config = require('../config');

const mapSizeX = Config.MAP_SIZE_X;
const mapSizeY = Config.MAP_SIZE_Y;

function Player() {
    this.id = shortid.generate();
    this.name = 'Player';
    this.level = 1;
    this.health = 2;
    this.kills = 0;
    this.action = { order: Action.ORDER_STOP };
    this.position = { x: 0, y: 0 };
    this.color = '92278f';
    this.animationDelay = 0;
}

Player.prototype.parse = function(withId) {
    let playerJSON = {
        name: this.name,
        level: this.level,
        health: this.health,
        kills: this.kills,
        action: this.action,
        position: this.position,
        color: this.color,
        animationDelay: this.animationDelay,
    };

    if (withId) {
        playerJSON.id = this.id;
    }

    return playerJSON;
};

Player.prototype.getActionPosition = function() {
    let position = {};

    let p = this.action.position;
    if (p.x >= -1 && p.x <= 1 && p.y >= -1 && p.y <= 1) {
        position.x = this.position.x + p.x;
        position.y = this.position.y + p.y;

        position.x =
            position.x < 0 ? 0 : position.x >= mapSizeX ? mapSizeX - 1 : position.x;
        position.y =
            position.y < 0 ? 0 : position.y >= mapSizeY ? mapSizeY - 1 : position.y;

    } else {
        throw new Error(this.id + ' position of order is invalid');
    }

    return position;
};

Player.prototype.checkForLevelUp = function() {
    if (this.kills > Math.pow(2, this.level - 1)) {
        this.level += 1;
        this.kills = 0;
        this.increaseHitPoints(2);
    }
};

Player.prototype.increaseHitPoints = function(healthToAdd) {
    this.health += healthToAdd;

    if (this.health > this.level * 2) {
        this.health = this.level * 2;
    }
};

Player.prototype.isDead = function() {
    return this.health <= 0;
};

module.exports = Player;
