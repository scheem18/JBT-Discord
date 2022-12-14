const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { JSDOM } = require('jsdom');

module.exports = {
	name: 'messageCreate',
	execute: async (message, client) => {
        if (message.content.startsWith('[[') && message.content.endsWith(']]')) {
            const pkgname = message.content.slice(2,message.content.length - 2);
            if (!pkgname) return;
            require('../utils/tweaksearch').search(message, pkgname);
        }
        const T4H_URL = /http(?:s)?:\/\/tools4hack.santalab.me\/([a-zA-Z0-9-]{1,1000}).html/g
        if (message.content.match(T4H_URL)) {
            const url = message.content.match(T4H_URL);
            console.log(url)
            const { data } = await axios.get(url[0]);
            console.log(data)
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
            message.channel.send({embeds:[embed]})
        }
	}
}