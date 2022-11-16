const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const reactionPagination = require('../../library/pagination');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('delay-status')
    .setDescription('遅延OTAのステータス')
    .addStringOption(option =>
        option.setName('プラットフォーム')
        .setDescription('プラットフォームを選択')
        .addChoices(
            {name:'iOS (iPhone14シリーズ)',value:'iOS (iPhone 14 series)'},
            {name:'iOS (iPhone8以降)',value:'iOS (all other non-legacy devices)'},
            {name:'iOS Legacy v2(iPhone7以下)',value:'iOS Legacy v2'},
            {name:'iOS Legacy (iPhone6以下)',value:'iOS Legacy'},
            {name:'iPadOS',value:'iPadOS'},
            {name:'iPadOS Legacy',value:'iPadOS Legacy'}
        )
        .setRequired(true)),

    run: async ({interaction}) => {
        await interaction.deferReply();
        let embeds = [];
        const createList = async (data, platform) => {
            data[platform].map((res) => {
                embeds.push(
                    new EmbedBuilder()
                    .setAuthor({name:'Powered by Delayed OTAs',url:'https://dhinakg.github.io/delayed-otas.html'})
                    .setTitle(res.name)
                    .addFields(
                        {name:'最新',value:`${res.latest}`,inline:true},
                        {name:'期限',value:(`${res.date ?? '最新版'}${res.imminent ? '(残りわずか)' : ''}`),inline:true},
                        {name:'MDMでの利用',value:(res.mdm_available ? '可能' : '不可'),inline:true},
                        {name:'MDMのみ',value:`${res.mdm_only}`}
                    )
                )
            });
        }
        axios.get('https://dhinakg.github.io/check-pallas/minified-v3.json').then(async ({data}) => {
            await createList(data, interaction.options.getString('プラットフォーム'));
            await reactionPagination.editReply({interaction,embeds});
        }).catch((err) => {
            interaction.editReply({content:'データを取得できませんでした'});
            console.log(err);
        })
    }
}