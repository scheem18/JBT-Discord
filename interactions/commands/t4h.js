const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const t4h = require('../../library/t4h');
const { InteractionEmbedControl } = require('../../library/embed-controller');

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
        const controller = new InteractionEmbedControl(interaction);
        const query = interaction.options.getString('search');
        try {
            const articles = await t4h.get(query);
            if (!articles) return await interaction.editReply({content:'記事が見つかりませんでした。'});
            while (articles.length > 5) {
                articles.pop();
            }
            await controller.setEmbeds(
                articles.map((article) =>
                new EmbedBuilder()
                .setAuthor({name:'Tools 4 Hack'})
                .setTitle(article.title)
                .setImage(article.thumbnail)
                .setURL(article.link)
                .setDescription(article.snippet)
                )
            );
            await controller.reply({deferred:true});
        } catch (err) {
            console.error(err);
            return await interaction.editReply({content:'記事を取得出来ませんでした。'});
        }
    }
}