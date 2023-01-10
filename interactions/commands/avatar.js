const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('メンバーのアバターを表示')
    .addUserOption(option =>
        option.setName('member')
        .setDescription('メンバーを選択')
    ),

    run:async ({interaction, client}) => {
        await interaction.deferReply();
        try {
            const id = interaction.options.getUser('member')?.id ?? interaction.user.id;
            const member = await interaction.guild.members.fetch(id);
            const user = await client.users.fetch(id);
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(user.displayAvatarURL({size:4096, dynamic:true}))
                .setLabel('デフォルトアバターを表示')
            );
            const embed = new EmbedBuilder()
            .setTitle(`${member.displayName}(${user.tag})`)
            .setImage(member.displayAvatarURL({size:4096, dynamic:true}))
            .setColor('Random');
            await interaction.editReply({embeds:[embed], components:[row]});
        } catch (err) {
            await interaction.editReply({content:'アバターの取得に失敗しました。'});
            console.error(err);
        }
    }
}