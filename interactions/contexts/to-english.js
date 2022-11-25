const deepl = require('deepl-node');
const translateMessages = require('../../translateMessages');
const { DEEPL_TOKEN } = require('../../config');
const translator = new deepl.Translator(DEEPL_TOKEN);
const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('to-english')
        .setType(ApplicationCommandType.Message),
	run: async ({interaction, client}) => {
        await interaction.deferReply();
        const targetId = interaction.targetId;
        const message = await interaction.channel.messages.fetch(targetId);
        if (!message.content) {
            return await interaction.editReply({content:'選択したメッセージに内容がありません。'});
        } else {
            if (translateMessages[targetId]?.en) {
                const embed = new EmbedBuilder()
                .setTitle(`${translateMessages[targetId].en.detectedSourceLang} から en に翻訳`)
                .setDescription(translateMessages[targetId].en.content.length > 4096 ? translateMessages[targetId].en.content.slice(0,4096) : translateMessages[targetId].en.content)
                .setColor('White')
                .setFooter({text:'Powered by DeepL Translator'});
                const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                .setLabel('Jump')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${targetId}`))
                if (translateMessages[targetId].en.content.length > 4096) {
                    row.addComponents(new ButtonBuilder()
                    .setLabel('全文を見る')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://jbt-discord.onrender.com/translateText/?id=${targetId}&targetLang=en`)
                    );
                }
                await interaction.editReply({embeds:[embed],components:[row]});
            }
            try {
                const { text, detectedSourceLang } = await translator.translateText(message.content,null,'en-US');
                translateMessages[targetId] = {
                    'en':{
                        detectedSourceLang:detectedSourceLang,
                        content:text
                    }
                }
                const embed = new EmbedBuilder()
                .setTitle(`${detectedSourceLang} から en に翻訳`)
                .setDescription(text.length > 4096 ? text.slice(0,4096) : text)
                .setColor('White')
                .setFooter({text:'Powered by DeepL Translator'});
                if (text.length > 4096) {
                    const row = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                    .setLabel('全文を見る')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://jbt-discord.onrender.com/translateText/?id=${targetId}&targetLang=en`)
                    );
                    await interaction.editReply({embeds:[embed],components:[row]});
                } else {
                    await interaction.editReply({embeds:[embed]});
                }
            } catch (err) {
                await interaction.editReply({content:'エラーが発生したため翻訳が出来ませんでした'})
                console.error(err);
            }
        }
	},
};