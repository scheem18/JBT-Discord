const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ipsw')
    .setDescription('ipswのリンク')
    .addStringOption(option =>
        option.setName('device')
        .setDescription('デバイスを選択')
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('version')
        .setDescription('バージョンを選択')
        .setAutocomplete(true)
        .setRequired(true)
    ),
    run: async ({ interaction }) => {
        try {
            await interaction.deferReply();
            const data = JSON.parse(fs.readFileSync('./json/main.json'));
            const device = interaction.options.getString('device');
            const version = interaction.options.getString('version');
            const found_ios = data.ios.filter(ios => (ios.build === version && ios.deviceMap.includes(device)));
            const ipsw = found_ios.map(ios => ios.devices[device].ipsw);
            if (!ipsw[0]) return await interaction.editReply({content:'リンクが見つかりませんでした。'});
            await interaction.editReply({content:ipsw.join('\n')});
        } catch (err) {
            await interaction.editReply({content:'エラーが発生しました。'});
            console.error(err);
        }
    }
}