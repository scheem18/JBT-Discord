const { WebhookClient } = require('discord.js');
module.exports = {
	name: 'messageUpdate',
	execute: async (message, client) => {
        console.log(message)
	},
};