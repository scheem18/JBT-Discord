const { WebhookClient } = require('discord.js');
module.exports = {
	name: 'inviteCreate',
	execute: async (invite, client) => {
        console.log(invite)
	},
};