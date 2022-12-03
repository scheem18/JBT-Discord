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
            try {
                const text = (translateMessages[targetId]?.en?.before?.content === message.content) ? translateMessages[targetId].en.after.content : (await (translator.translateText(message.content,null,'en-US'))).text;
                const detectedSourceLang = translateMessages[targetId]?.en?.detectedSourceLang ? translateMessages[targetId].en.detectedSourceLang : (await (translator.translateText(message.content,null,'en-US'))).detectedSourceLang;
                translateMessages[targetId] = {
                    'en':{
                        detectedSourceLang:detectedSourceLang,
                        before: {
                            content: message.content
                        },
                        after: {
                            content: text
                        }
                    }
                }
                const embed = new EmbedBuilder()
                .setTitle(`${detectedSourceLang} から en に翻訳`)
                .setDescription(text.length > 4096 ? text.slice(0,4096) : text)
                .setColor('White')
                .setFooter({text:'Powered by DeepL Translator'});
                const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                .setLabel('Jump')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${targetId}`))
                if (text.length > 4096) {
                    row.addComponents(new ButtonBuilder()
                    .setLabel('全文を見る')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://jbt-scheem18.koyeb.app/translateText/?id=${targetId}&targetLang=en`)
                    );
                }
                await interaction.editReply({embeds:[embed],components:[row]});
            } catch (err) {
                console.error(err);
                await interaction.editReply({content:'エラーが発生したため翻訳が出来ませんでした'});
            }
        }
	},
};