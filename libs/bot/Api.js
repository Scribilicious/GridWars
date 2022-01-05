const fetch = require('node-fetch');
const port = process.env.PORT || 3000;
const URL = 'http://localhost:' + port +'/api/controller';

const Api = {
    call(method = 'GET', data) {
        let request = {
            method,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (method === 'POST' || method === 'PUT') {
            request = { ...request, body: JSON.stringify(data) };
        }

        return fetch(URL, request).then(response => response.json());
    },
};

module.exports = Api;
