const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data:new SlashCommandBuilder()
    .setName('jailbreak')
    .setDescription('脱獄ツールの詳細を表示'),

    run: async ({interaction}) => {
        const focused = interaction.options.getFocused(true);
        const jailbreaks = JSON.parse(fs.readFileSync('./json/main.json')).jailbreak;
        const found_jbs = jailbreaks.map(jb => ({name:jb.name,value:jb.name}));
        const filtered = found_jbs.filter(jb => (jb.name.startsWith(focused.value)));
        while (filtered.length > 25) {
            filtered.pop();
        }
        await interaction.respond(filtered);
    }
}