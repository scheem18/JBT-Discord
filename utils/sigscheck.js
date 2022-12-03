const { JSDOM } = require('jsdom');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    sigscheck: async (client) => {
        try {
            const get_ioshaven = await axios.get('https://ioshaven.com/search')
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
            const embed = new EmbedBuilder()
            .setTitle('署名状況')
            .addFields(fields)
            .setColor('5662F6')
            .setFooter({text:'Powered by iOS Haven and jailbreaks.app'})
            .setTimestamp();
            await client.channels.cache.find(x => x.name === 'jbt署名通知').forEach(x => x.send({embeds:[embed]}));
        } catch (err) {
            console.error(err);
        }
    }
}