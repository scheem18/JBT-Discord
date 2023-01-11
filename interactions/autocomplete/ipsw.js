const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ipsw')
    .setDescription('ipswのリンク'),
    run: async ({ interaction }) => {
        const focused = interaction.options.getFocused(true);
        const data = JSON.parse(fs.readFileSync('./json/main.json'));
        if (focused.name === 'device') {
            const devices = data.device
            .filter(x => (x.type === 'iPhone' || x.type === 'iPad'))
            .map(device => ({name:device.name,value:device.key}));
            const filtered = devices.filter(device => (device.name.startsWith(focused.value) || device.value.startsWith(focused.value)));
            while (filtered.length > 25) {
                filtered.pop();
            }
            await interaction.respond(filtered);
        } else if (focused.name === 'version') {
            const device = interaction.options.getString('device');
            const ios = data.ios
            .filter(x => (x.osType === 'iOS' && x.deviceMap.includes(device)))
            .map(i => ({name:i.version,value:i.build}));
            const filtered = ios.filter(i => (i.name.startsWith(focused.value) || i.value.startsWith(focused.value)));
            while (filtered.length > 25) {
                filtered.pop();
            }
            await interaction.respond(filtered);
        }
    }
}