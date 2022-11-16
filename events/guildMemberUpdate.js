const { WebhookClient } = require('discord.js');
module.exports = {
	name: 'guildMemberUpdate',
	execute: async (member, client) => {
        console.log(member)
	},
};