const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();
const reactionPagination = require('../../library/pagination');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('t4h')
    .setDescription('tools4hackの記事を取得')
    .addStringOption(option =>
        option.setName('search')
        .setDescription('tools4hack内の記事を検索')
    ),
    run: async ({ interaction }) => {
        await interaction.deferReply();
        const embeds = [];
        const query = interaction.options.getString('search');
        try {
            const article = await parser.parseURL(`https://tools4hack.santalab.me/rss/${!query ? '' : `?s=${query}`}`);
            while (article.items.length > 5) {
                article.items.pop();
            }
            article.items.map(x => {
                embeds.push(
                    new EmbedBuilder()
                    .setAuthor({name:'Tools 4 Hack'})
                    .setTitle(x.title)
                    .setURL(x.link)
                    .setDescription(x.content)
                );
            });
            if (embeds.length === 1) return await interaction.editReply({embeds:[embeds[0]]});
            await reactionPagination.editReply({interaction,embeds});
        } catch (err) {
            console.error(err);
            return await interaction.editReply({content:'記事を取得出来ませんでした。'});
        }
    }
}