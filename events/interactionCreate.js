const fs = require('fs');

module.exports = {
	name: 'interactionCreate',
	execute: async (interaction, client) => {
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands[interaction.commandName];
      if (!command) {
        await interaction.reply({
          content: "コマンドが存在しません",
          ephemeral: true,
        });
      }
      await command.run({ client, interaction });
    } else if (interaction.isMessageContextMenuCommand()) {
      const context = client.contextMenus[interaction.commandName];
      if (!context) {
        await interaction.reply({
          content: "コマンドが存在しません",
          ephemeral: true,
        });
      }
      await context.run({ client, interaction });
    } else if (interaction.isAutocomplete()) {
      if (interaction.commandName === 'canijailbreak') {
        const focused = interaction.options.getFocused(true);
        const data = JSON.parse(fs.readFileSync('main.json'));
        let filtered;
        if (focused.name === 'device') {
          const devices = data.device.filter(x => (x.type.match(/iPad|iPhone|iPod touch/))).map(x => {
            return {name:x.name, value:x.identifier[0]}
          });
          filtered = devices.filter(x => (x.name.toLowerCase().startsWith(focused.value.toLowerCase()) || x.value.toLowerCase().startsWith(focused.value.toLowerCase()))) 
          while (filtered.length > 25) {
            filtered.pop();
          }
        }
        if (focused.name === 'version') {
          const versions = data.ios.filter(x => (x.osType === 'iOS' && x.deviceMap.includes(interaction.options.getString('device')))).map(x => {
            return {name:x.version, value:x.build}
          })
          filtered = versions.filter(x => (x.name.toLowerCase().startsWith(focused.value.toLowerCase()) || x.value.toLowerCase().startsWith(focused.value.toLowerCase()))) 
          while (filtered.length > 25) {
            filtered.pop();
          }
        }
        await interaction.respond(filtered);
      }
    }
	}
}