const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { JSDOM } = require('jsdom');

module.exports = {
	name: 'messageCreate',
	execute: async (message, client) => {
        let result;
        const PKG_PATTERN = /\[\[(?<pkgname>[\w-._]{1,})]]/g
        while ((result = PKG_PATTERN.exec(message.content)) !== null) {
            require('../utils/tweaksearch').search(message, result.groups.pkgname);
        }
        if (message.content.match(/http(?:s)?:\/\/tools4hack.santalab.me\/([\w-]{1,}).html/g)) {
            try {
                const url = message.content.match(/http(?:s)?:\/\/tools4hack.santalab.me\/([\w-]{1,}).html/g);
                const { data } = await axios.get(url[0]);
                const document = new JSDOM(data).window.document;
                const title = Array.from((document.querySelectorAll('h1.entry-title')), item => item.textContent.trim());
                const description = Array.from((document.querySelectorAll('p')), item => item.textContent.trim());
                const thumbnail = Array.from((document.querySelectorAll('img.attachment-500x350.size-500x350.eye-catch-image.wp-post-image')), item => item.getAttribute('src'));
                const embed = new EmbedBuilder()
                .setAuthor({name:'Tools 4 Hack'})
                .setTitle(title[0])
                .setURL(url[0])
                .setDescription(description[0].length > 100 ? `${description[0].slice(0,100)}...` : description[0])
                .setImage(thumbnail[0]);
                message.channel.send({embeds:[embed]});
            } catch (err) {
                console.error(err);
            }
        }
	}
}