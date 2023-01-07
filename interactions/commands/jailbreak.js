const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data:new SlashCommandBuilder()
    .setName('jailbreak')
    .setDescription('脱獄ツールの詳細を表示')
    .addStringOption(option =>
        option.setName('name')
        .setDescription('脱獄ツールの名前')
        .setAutocomplete(true)
        .setRequired(true)
    ),
    run: async ({interaction}) => {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        const jailbreaks = JSON.parse(fs.readFileSync('./json/main.json')).jailbreak;
        const index = jailbreaks.findIndex(jb => jb.name === name);
        if (index < 0) 
            return await interaction.editReply({content:'指定した名前に一致する脱獄ツールは見つかりませんでした。'});
        const jailbreak = jailbreaks[index];
        const embed = new EmbedBuilder()
        .setTitle(jailbreak.name)
        .setURL(jailbreak.info.website?.url ?? null)
        .addFields(
            {name:jailbreak.info.latestVer ? 'バージョン' : '\u200b', value:jailbreak.info.latestVer ?? '\u200b', inline:true},
            {name:jailbreak.info.firmwares ? '互換性' : '\u200b', value:jailbreak.info.firmwares ? `iOS ${jailbreak.info.firmwares?.join(' - ')}` : '\u200b', inline:true},
            {name:jailbreak.info.type ? '種類' : '\u200b', value:jailbreak.info.type ?? '\u200b', inline:true},
            {name:jailbreak.info.notes ? '注釈' : '\u200b', value:jailbreak.info.notes ?? '\u200b',inline:true}
        )
        .setColor(jailbreak.info.color ?? null)
        .setThumbnail(jailbreak.info.icon ? `https://appledb.dev${jailbreak.info.icon}` : null)
        .setFooter({text:'Powered by https://appledb.dev'});
        await interaction.editReply({embeds:[embed]});
    }
}