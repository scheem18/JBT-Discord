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
    }
	}
}