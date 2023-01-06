const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('delay-status')
    .setDescription('遅延OTAのステータス'),

    run: async ({interaction}) => {
        const data = JSON.parse(fs.readFileSync('./json/delay.json'));
        const platforms = Object.keys(data);
        await interaction.respond(
            platforms.filter(x => x !== '_date').map(choice => ({name:choice,value:choice}))
        );
    }
}