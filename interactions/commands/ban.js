const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('ばん')
    .addSubcommand(command =>
        command.setName('member')
        .setDescription('メンバーをban')
        .addUserOption(option =>
            option.setName('member')
            .setDescription('banするメンバーを選択')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('ban理由を入力'))
        )
    .addSubcommand(command =>
        command.setName('unban')
        .setDescription('メンバーのbanを解除')
        .addStringOption(option =>
            option.setName('user')
            .setDescription('ban解除するユーザーを選択')
            .setAutocomplete(true)
            .setRequired(true))
        ),

    run: async ({client, interaction}) => {
        if (!interaction.guild) return await interaction.reply({content:'サーバー内で実行してください。', ephemeral:true});
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({content:'あなたにはメンバーをBanする権限がありません', ephemeral:true});
        if (interaction.options.getSubcommand() === 'member') {
            const user = interaction.options.getUser('member');
            const member = await interaction.guild.members.fetch(user.id);
            const reason = interaction.options.getString('reason');
            if (!member.bannable) return await interaction.reply({content:'このメンバーをBanすることは出来ません。', ephemeral:true});
            try {
                await member.ban({reason:reason});
                await interaction.reply({content:`${user.tag}をBanしました。`});
            } catch (err) {
                await interaction.reply({content:`${user.tag}をBanすることが出来ませんでした。`});
                console.error(err);
            }
        } else if (interaction.options.getSubcommand() === 'unban') {
            const user = await client.users.fetch(interaction.options.getString('user'));
            try {
                await interaction.guild.members.unban(user.id);
                await interaction.reply({content:`${user.tag}のBanを解除しました。`});
            } catch (err) {
                await interaction.reply({content:`${user.tag}のBanを解除することが出来ませんでした。`, ephemeral:true});
                console.error(err);
            }
        }
    }
}