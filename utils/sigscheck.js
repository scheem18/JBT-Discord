const { JSDOM } = require('jsdom');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const axios = require('axios');
const { SIGNATURE_WEBHOOKURL } = require('../config');

module.exports = {
    sigscheck: async () => {
        try {
            const ioshaven = new JSDOM(await (axios.get('https://ioshaven.com/search')).data).window.document;
            const jbapp = await axios.get('https://api.jailbreaks.app/status');
            const providers = [
                'App Valley','Apple','CokernutX','EonHub','iOS Gods','iOS Haven','Panda Helper','TutuBox','Jailbreaks.app'
            ]
            const status = []
            const fields = [];
            ioshaven.querySelectorAll('span.mr-1').forEach(x => status.push(x.textContent));
            status.push(jbapp.data.status);
            for (let i = 0; i < 9; i++) {
                fields.push({name:providers[i],value:status.filter(x => x.match(/Revoked|Working|Signed/))[i].replace(/Revoked/,'❌署名切れ').replace(/Signed|Working/,'✅復活中'),inline:true});
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
        } catch (err) {
            console.error(err);
        }
    }
}