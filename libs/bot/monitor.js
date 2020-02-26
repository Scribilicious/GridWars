const Api = require('./Api');

setInterval(function() {
    Api.call('GET')
        .then(data => {
            console.log(JSON.stringify(data));
        })
        .catch(error => console.error(error));
}, 5000);
