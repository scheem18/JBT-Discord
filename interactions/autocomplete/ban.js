const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('ばん'),

    run: async ({interaction}) => {
        const focused = interaction.options.getFocused(true);
        if (focused.name === 'user') {
            const fetch_bans = await interaction.guild.bans.fetch();
            const ban_list = fetch_bans.map(ban => ({name:ban.user.tag,value:ban.user.id}));
            const filtered = ban_list.filter(bans => (bans.name.startsWith(focused.value) || bans.value.startsWith(focused.value)));
            while (filtered.length > 25) {
                filtered.pop();
            }
            
            await interaction.respond(filtered);
        }
    }
}