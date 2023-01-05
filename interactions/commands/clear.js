const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
    .setName('clear')
    .setDescription('メッセージを一括削除')
    .addNumberOption(option =>
        option.setName('amount')
        .setDescription('削除する数を入力')
        .setRequired(true)
    ),

    run: async ({interaction}) => {
        const delNumber = interaction.options.getNumber('amount');
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({content:'あなたにはメッセージを管理する権限がありません。'});
        if (delNumber > 100) return await interaction.reply({content:'100件以上のメッセージを一括削除することは出来ません。'});
        try {
            const deleted = await interaction.channel.bulkDelete(delNumber);
            await interaction.editReply({content:`${deleted.size}/${delNumber}削除しました。`});
        } catch (err) {
            await interaction.editReply({content:'メッセージの削除に失敗しました。'});
            console.error(err);
        }
    }
}