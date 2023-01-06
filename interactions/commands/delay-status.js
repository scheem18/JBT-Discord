const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { InteractionEmbedControl } = require('../../library/embed-controller');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('delay-status')
    .setDescription('遅延OTAのステータス')
    .addStringOption(option =>
        option.setName('platform')
        .setDescription('プラットフォームを選択')
        .setAutocomplete(true)
        .setRequired(true)),

    run: async ({interaction}) => {
        await interaction.deferReply();
        const controller = new InteractionEmbedControl(interaction);
        const data = JSON.parse(fs.readFileSync('./json/delay.json','utf-8'));
        const platform = interaction.options.getString('platform');
        const embeds = data[platform].map(x => 
            new EmbedBuilder()
            .setAuthor({name:'Powered by Delayed OTAs',url:'https://dhinakg.github.io/delayed-otas.html'})
            .setTitle(x.name)
            .addFields(
                {name:'最新バージョン',value:`${x.latest}`,inline:true},
                {name:(x.latest ? '\u200b' : '期限'),value:(x.latest ? '\u200b' : `<t:${Math.floor(new Date(x.date).getTime() / 1000)}>`),inline:true},
                {name:'MDMでの利用',value:(x.mdm_available ? '可能' : '不可'),inline:true},
                {name:'MDMのみ',value:`${x.mdm_only}`}
            )
        );
        await controller.reply(embeds, {deferred:true});
    }
}