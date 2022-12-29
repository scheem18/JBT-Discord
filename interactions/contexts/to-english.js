const deepl = require('deepl-node');
require('dotenv').config();
const translator = new deepl.Translator(process.env['DEEPL_TOKEN']);
const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
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
                const { text, detectedSourceLang } = (await (translator.translateText(message.content,null,'en-US')));
                if (text.length > 4096) {
                    const full_result = new AttachmentBuilder(Buffer.from(text,'utf-8'), {name:'full_result.txt'});
                    await interaction.editReply({content:`${detectedSourceLang} から en に翻訳\n(字数制限を超えているためテキストファイルとして送信します。)`, files:[full_result]});
                    return;
                }
                const embed = new EmbedBuilder()
                .setTitle(`${detectedSourceLang} から en に翻訳`)
                .setDescription(text.length > 4096 ? `${text.slice(0,4093)}...` : text)
                .setColor('White')
                .setFooter({text:'Powered by DeepL Translator'});
                const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                .setLabel('Jump')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${targetId}`))
                await interaction.editReply({embeds:[embed],components:[row]});
            } catch (err) {
                console.error(err);
                await interaction.editReply({content:'エラーが発生したため翻訳が出来ませんでした'});
            }
        }
	},
};