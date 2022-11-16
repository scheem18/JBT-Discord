const { WebhookClient } = require('discord.js');
module.exports = {
	name: 'messageUpdate',
	execute: async (message, client) => {
		if (message.author.bot) return;
        console.log(message)
	},
};