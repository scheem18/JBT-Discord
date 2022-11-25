const { JSDOM } = require('jsdom');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const axios = require('axios');
const { SIGNATURE_WEBHOOKURL } = require('../config');

module.exports = {
    sigscheck: async () => {
        try {
            const get_ioshaven = await axios.get('https://ioshaven.com/search')
            console.log(get_ioshaven.status)
            const ioshaven = new JSDOM(get_ioshaven.data).window.document;
            const jbapp = await axios.get('https://api.jailbreaks.app/status');
            const providers = [
                'App Valley','Apple','CokernutX','EonHub','iOS Gods','iOS Haven','Panda Helper','TutuBox','Jailbreaks.app'
            ]
            const status = []
            const fields = []
            ioshaven.querySelectorAll('span.mr-1').forEach(x => {
                if (x.textContent.match(/Revoked|Working/)) {
                    status.push(x.textContent);
                }
            })
            
            await status.push(jbapp.data.status);
            for (let i = 0; i < 9; i++) {
                fields.push({name:providers[i],value:status[i].replace(/Revoked/,'❌署名切れ').replace(/Working|Signed/,'✅復活中'),inline:true});
            }
            console.log(fields)
            const webhook = new WebhookClient({url:SIGNATURE_WEBHOOKURL});
            const embed = new EmbedBuilder()
            .setTitle('署名状況')
            .addFields(fields)
            .setColor('5662F6')
            .setFooter({text:'Powered by iOS Haven and jailbreaks.app'})
            .setTimestamp();
            await webhook.send({embeds:[embed]});
        } catch (err) {
            console.error(err);
        }
    }
}