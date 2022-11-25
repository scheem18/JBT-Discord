const { JSDOM } = require('jsdom');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const axios = require('axios');
const { SIGNATURE_WEBHOOKURL } = require('../config');

module.exports = {
    sigscheck: async () => {
        try {
            const {data} = await axios.get('https://api.jailbreaks.app/status');
            const webhook = new WebhookClient({url:SIGNATURE_WEBHOOKURL});
            const embed = new EmbedBuilder()
            .setTitle('署名状況')
            .addFields({name:'jailbreaks.app',value:data.status.replace('Revoked','❌署名切れ').replace('Signed','✅復活中')})
            .setColor('5662F6')
            .setFooter({text:'Powered by jailbreaks.app'})
            .setTimestamp();
            await webhook.send({embeds:[embed]});
        } catch (err) {
            console.error(err);
        }
    }
}