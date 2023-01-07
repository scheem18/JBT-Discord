const axios = require('axios');
const fs = require('fs');

function cron (client) {
    axios.get('https://dhinakg.github.io/check-pallas/minified-v3.json').then(({data}) => {
        fs.writeFileSync('./json/delay.json', JSON.stringify(data), 'utf-8');
    }).catch(console.error);
    axios.get('https://api.appledb.dev/main.json').then(({data}) => {
        fs.writeFileSync('./json/main.json', JSON.stringify(data), 'utf-8');
    }).catch(console.error);
    require('./sigscheck').sigscheck(client);
    setInterval(() => {
        axios.get('https://dhinakg.github.io/check-pallas/minified-v3.json').then(({data}) => {
            fs.writeFileSync('./json/delay.json', JSON.stringify(data), 'utf-8');
        }).catch(console.error);
        axios.get('https://api.appledb.dev/main.json').then(({data}) => {
            fs.writeFileSync('./json/main.json', JSON.stringify(data), 'utf-8');
        }).catch(console.error);
    },21600000);
}

module.exports = cron;