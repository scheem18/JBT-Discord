const { JSDOM } = require('jsdom');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const axios = require('axios');
const { SIGNATURE_WEBHOOKURL } = require('../config');

module.exports = {
    sigscheck: async () => {
        axios.get('https://ioshaven.com/search').then(async(res) => {
            const dom = new JSDOM(res.data);
            const document = dom.window.document;
            const providers = [
                'App Valley','Apple','CokernutX','EonHub','iOS Gods','iOS Haven','Panda Helper','TutuBox'
            ]
            const status = Array.from((document.querySelectorAll('span.mr-1')), item => item.textContent);
            const fields = [];
            for (let i = 0; i < 8; i++) {
                fields.push({name:providers[i],value:status.filter(x => x !== '\n\n')[i].replace('Revoked','❌署名切れ').replace('Working','✅復活中'),inline:true});
            }
            const webhook = new WebhookClient({url:SIGNATURE_WEBHOOKURL});
            const embed = new EmbedBuilder()
            .setAuthor({name:'iOS Haven'})
            .setTitle('署名状況')
            .setURL('https://ioshaven.com/search')
            .addFields(fields)
            .setColor('5662F6')
            .setTimestamp();
            await webhook.send({embeds:[embed]});
        }).catch(console.log);
    }
}