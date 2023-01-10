const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ぴん'),

    run:async ({interaction,client}) => {
        await interaction.reply({content:`BOT: ${Date.now() - interaction.createdTimestamp}ms\nAPI: ${client.ws.ping}ms`})
    }
}