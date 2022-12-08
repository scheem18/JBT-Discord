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
        try {
          const focused = interaction.options.getFocused(true);
          const data = JSON.parse(fs.readFileSync('main.json'));
          let filtered;
          if (focused.name === 'device') {
            const devices = data.group.filter(device => device.type === 'iPhone');
            const list = devices.map(device => ({name:device.name, value:device.name}));
            filtered = list.filter(x => (x.name.startsWith(focused.value)));
            while (filtered.length > 25) {
                filtered.pop()
            }
          }
          if (focused.name === 'version') {
            const input_device = interaction.options.getString('device');
            const device = data.group.filter(group => (group.type === 'iPhone' && group.key.toLowerCase() === input_device.toLowerCase()));
            const versions = data.ios.filter(x => (x.osStr === 'iOS' && x.deviceMap.includes(device[0].devices[0]))).map(x => {
              return {name:x.version, value:x.version}
            })
            filtered = versions.filter(x => (x.name.startsWith(focused.value))) 
            while (filtered.length > 25) {
              filtered.pop();
            }
          }
          await interaction.respond(filtered);
        } catch (err) {
          console.error(err);
        }
      }
    }
	}
}