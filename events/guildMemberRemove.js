const { WebhookClient } = require('discord.js');
module.exports = {
	name: 'guildMemberRemove',
	execute: async (member, client) => {
        console.log(member)
	},
};