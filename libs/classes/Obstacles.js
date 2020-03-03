class Obstacles {

    constructor(config) {
        this.config = config;
        this.obstacles = [];
        this.generate();
    }

    get map() {
        return this.obstacles;
    }

    generate() {
        this.damageCount = 0;
        this.obstacles = [];

        for (let i = 0; i < this.config.OBSTACLES; i++) {
            this.add();
        }

        return this.obstacles;
    }

    add() {
        let x = null;
        let y = null;
        let damage = 0;

        while (
            x === null ||
            this.checkPosition({x, y}) === true
        ) {
            x = this.randomInt(0, this.config.MAP_SIZE_X - 1);
            y = this.randomInt(0, this.config.MAP_SIZE_Y - 1);
        }

        if (this.damageCount < this.config.OBSTACLES_DAMAGE) {
            damage = 1;
            this.damageCount++;
        }

        this.obstacles.push({
            x,
            y,
            damage,
            type : this.randomInt(0, this.config.OBSTACLES_TYPES)
        });
    }

    checkPosition(position) {
        const size = this.obstacles.length;

        if (!size) {
            return false;
        }

        for (let i = 0; i < size; i++) {
            if (this.obstacles[i].x === position.x && this.obstacles[i].y === position.y) {
                return true;
            }
        }

        return false;
    }

    randomInt(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low)
    }
}

module.exports = (config) => { return new Obstacles(config) }
