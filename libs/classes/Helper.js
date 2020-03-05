class Helper {
    constructor() {
        this.config = require('../config');
    }

    output(...params) {
        if (this.config.DEBUG) {
            console.log(params);
        }
    }
}

module.exports = new Helper();
