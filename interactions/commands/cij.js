const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const reactionPagination = require('../../library/pagination');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('canijailbreak')
    .setDescription('jb')
    .addStringOption(option => 
        option.setName('device')
        .setDescription('select a device')
        .setRequired(true)
        .setAutocomplete(true))
    .addStringOption(option => 
        option.setName('version')
        .setDescription('select a version')
        .setRequired(true)
        .setAutocomplete(true)),

    run: async ({interaction}) => {
        try {
            await interaction.deferReply();
            const data = JSON.parse(fs.readFileSync('main.json'));
            const device = interaction.options.getString('device');
            const version = interaction.options.getString('version');
            const device_name = data.device.filter(x => x.key.toLowerCase() === device.toLowerCase())[0].name;
            const firmware = data.ios.filter(x => x.uniqueBuild === version)[0];
            const embeds = [];
            data.jailbreak.map(x => {
                if (x.compatibility) {
                    x.compatibility.map(y => {
                        if (y.devices.includes(device) && y.firmwares.includes(version)) {
                            embeds.push(
                                new EmbedBuilder()
                                .setTitle('あなたのデバイスは脱獄可能です！')
                                .setDescription(`${x.name}は${device_name}, ${firmware.osStr} ${firmware.version}上で動作可能です。`)
                                .addFields([
                                    {name:`${x.info.latestVer ? 'バージョン' : '\u200b'}`, value:`${x.info.latestVer ?? '\u200b'}`, inline:true},
                                    {name:'対応バージョン', value:`${x.info.firmwares[0]} - ${x.info.firmwares[1]}`, inline:true},
                                    {name:'脱獄タイプ', value: x.info.type, inline:true},
                                    {name:`${x.info.notes ? 'note' : '\u200b'}`, value:`${x.info.notes ?? '\u200b'}`, inline:true},
                                    {name:`${x.info?.website?.url ? 'サイト' : '\u200b'}`, value:`${x.info?.website?.url ?? '\u200b'}`}
                                ])
                                .setColor(x.info.color ?? null)
                                .setThumbnail(`https://appledb.dev${x.info.icon}`)
                            )
                        }
                    })
                }
            });
            if (!embeds[0]) return await interaction.editReply({content:'残念ですが、あなたのデバイスを脱獄することは出来ません。'});
            if (embeds.length === 1) return await interaction.editReply({embeds:[embeds[0]]});
            await reactionPagination.editReply({interaction,embeds});
        } catch (err) {
            await interaction.editReply({content:'エラーが発生しました。'})
            console.error(err)
        }
    }
}