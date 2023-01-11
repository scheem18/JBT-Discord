const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
    .setName('info')
    .setDescription('いんふぉs')
    .addSubcommand(command =>
        command.setName('member')
        .setDescription('メンバーの情報を取得')
        .addUserOption(option =>
            option.setName('member')
            .setDescription('メンバーを選択')
        )
    )
    .addSubcommand(command =>
        command.setName('guild')
        .setDescription('サーバーの情報を取得')
    )
    .addSubcommand(command =>
        command.setName('bot')
        .setDescription('このBotの情報を表示')
    ),

    run: async ({interaction, client}) => {
        if (!interaction.guild) return await interaction.reply({content:'サーバー内で実行してください。'});
        if (interaction.options.getSubcommand() === 'member') {
            await interaction.deferReply();
            try {
                const id = interaction.options.getUser('member')?.id ?? interaction.user.id;
                const user = await client.users.fetch(id, {force:true});
                const member = await interaction.guild.members.fetch(id);
                const embed = new EmbedBuilder()
                .setAuthor({name:user.tag, iconURL:user.displayAvatarURL()})
                .setTitle(`${member.displayName}の情報`)
                .setThumbnail(member.displayAvatarURL())
                .setImage(user.bannerURL({dynamic:true, size:4096}))
                .setColor('Random')
                .addFields(
                    {name:'ユーザー名', value:user.tag, inline:true},
                    {name:'ニックネーム', value:member.displayName, inline:true},
                    {name:'ユーザーID', value:`${user.id}`, inline:true},
                    {name:'サーバー参加日', value:`<t:${Math.floor(member.user.createdTimestamp / 1000)}:F> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`, inline:true},
                    {name:'アカウント作成日', value:`<t:${Math.floor(member.joinedTimestamp / 1000)}:F> (<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`, inline:true}
                );
                await interaction.editReply({embeds:[embed]});
            } catch (err) {
                await interaction.editReply({content:'ユーザー情報の取得に失敗しました。'});
                console.error(err);
            }
        } else if (interaction.options.getSubcommand() === 'guild') {
            await interaction.deferReply();
            try {
                const guild = interaction.guild;
                const owner = await guild.fetchOwner();
                const embed = new EmbedBuilder()
                .setTitle(`${guild.name}の情報`)
                .setThumbnail(guild.iconURL())
                .setImage(guild.bannerURL({dynamic:true, size:4096}))
                .setColor('Random')
                .addFields(
                    {name:'サーバー名', value:guild.name, inline:true},
                    {name:'サーバーID', value:`${guild.id}`, inline:true},
                    {name:'サーバーオーナー', value:`${owner.displayName}(<@${owner.id}>)`, inline:true},
                    {name:'メンバー数', value:`${guild.memberCount}`, inline:true},
                    {name:'チャンネル数', value:`${guild.channels.channelCountWithoutThreads}`, inline:true},
                    {name:'ブースト数', value:`${guild.premiumSubscriptionCount}`, inline:true},
                    {name:'サーバー作成日', value:`<t:${Math.floor(guild.createdTimestamp / 1000)}:F> (<t:${Math.floor(guild.createdTimestamp / 1000)}:R>)`}
                )
                await interaction.editReply({embeds:[embed]});
            } catch (err) {
                await interaction.editReply({content:'サーバー情報の取得に失敗しました。'});
                console.error(err);
            }
        } else if (interaction.options.getSubcommand() === 'bot') {
            const author = await client.users.fetch('783305816702844990');
            const embed = new EmbedBuilder()
            .setTitle('このBotの情報')
            .addFields(
                {name:'ユーザー名', value:client.user.tag, inline:true},
                {name:'ユーザーID', value:`${client.user.id}`, inline:true},
                {name:'作成者', value:`${author.tag}(783305816702844990)`, inline:true},
                {name:'ライブラリ', value:'discord.js 14.7.1', inline:true},
                {name:'ソースコード', value:'https://github.com/scheem18/JBT-Discord', inline:true},
                {name:'ping', value:`\`\`\`\n# API\n${client.ws.ping}ms\n# BOT\n${Date.now() - interaction.createdTimestamp}ms\n\`\`\``}
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor('Random')
            await interaction.reply({embeds:[embed]});
        }
    }
}