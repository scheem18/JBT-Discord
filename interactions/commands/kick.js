const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('メンバーをキック')
    .addUserOption(option =>
        option.setName('member')
        .setDescription('キックするメンバーを選択')
        .setRequired(true))
    .addStringOption(option =>
        option.setName('reason')
        .setDescription('キック理由を入力')),

    run: async ({interaction}) => {
        if (!interaction.guild) return await interaction.reply({content:'サーバー内で実行してください。', ephemeral:true});
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({content:'あなたにはメンバーをキックする権限がありません。', ephemeral:true});
        const user = interaction.options.getUser('member');
        const member = await interaction.guild.members.fetch(user.id);
        const reason = interaction.options.getString('reason');
        if (!member.kickable) return await interaction.reply({content:'このメンバーをキックすることは出来ません。', ephemeral:true});
        try {
            await member.kick(reason);
            await interaction.reply({content:`${user.tag}をキックしました。`});
        } catch (err) {
            await interaction.reply({content:`${user.tag}をキック出来ませんでした。`});
            console.error(err);
        }
    }
}