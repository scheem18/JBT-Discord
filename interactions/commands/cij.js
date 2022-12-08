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
            const input_device = interaction.options.getString('device');
            const input_version = interaction.options.getString('version');
            const device = data.group.filter(group => (group.type === 'iPhone' && group.key.toLowerCase() === input_device.toLowerCase()));
            const version = data.ios.filter(ios => (ios.osStr === 'iOS' && ios.version === input_version));
            const jailbreaks = data.jailbreak.filter(jb => jb.compatibility);
            const found_jbs = []
            const embeds = []
            jailbreaks.map(jb => {
                jb.compatibility.forEach(compatible => {
                    if (compatible.devices.includes(device[0].devices[0]) && compatible.firmwares.includes(version[0].internal ? version[0+1].uniqueBuild : version[0].uniqueBuild)) {
                        if (!found_jbs.includes(jb.name)) {
                            found_jbs.push(jb.name);
                            embeds.push(
                                new EmbedBuilder()
                                .setTitle('あなたのデバイスは脱獄可能です！')
                                .setDescription(`${jb.name}は${input_device}, iOS ${input_version}上で動作可能です！`)
                                .addFields([
                                    {name:'対応バージョン', value:`${jb.info.firmwares[0]} - ${jb.info.firmwares[1]}`, inline:true},
                                    {name:'脱獄タイプ', value: jb.info.type, inline:true},
                                    {name:`${jb.info.latestVer ? 'バージョン' : '\u200b'}`, value:`${jb.info.latestVer ?? '\u200b'}`, inline:true},
                                    {name:`${jb.info?.website?.url ? 'サイト' : '\u200b'}`, value:`${jb.info?.website?.url ?? '\u200b'}`},
                                    {name:`${jb.info.notes ? 'note' : '\u200b'}`, value:`${jb.info.notes ?? '\u200b'}`, inline:true}
                                ])
                                .setColor(jb.info.color ?? null)
                                .setThumbnail(`https://appledb.dev${jb.info.icon}`)
                            );
                        }
                    }
                });
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