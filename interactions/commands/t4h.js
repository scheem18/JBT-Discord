const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Parser = require('rss-parser');
const t4h = require('../../library/t4h');
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
            const articles = await t4h.get(query);
            if (!articles) return await interaction.editReply({content:'記事が見つかりませんでした。'});
            while (articles.length > 5) {
                articles.pop();
            }
            articles.map((article) => {
                embeds.push(
                    new EmbedBuilder()
                    .setAuthor({name:'Tools 4 Hack'})
                    .setTitle(article.title)
                    .setImage(article.thumbnail)
                    .setURL(article.link)
                    .setDescription(article.snippet)
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