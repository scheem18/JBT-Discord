const { WebhookClient } = require('discord.js');
module.exports = {
	name: 'guildMemberAdd',
	execute: async (member, client) => {
        console.log(member)
	},
};