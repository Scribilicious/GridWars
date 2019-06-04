const fetch = require('node-fetch');

const URL = 'http://localhost:3000/api/vikings';

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
