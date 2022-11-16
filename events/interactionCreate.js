module.exports = {
	name: 'interactionCreate',
	execute: async (interaction, client) => {
        if (!interaction.isChatInputCommand()) return;
        const command = client.slashCommands[interaction.commandName];
        if (!command) {
          await interaction.reply({
            content: "コマンドが存在しません",
            ephemeral: true,
          });
        }
        await command.run({ client, interaction });
	}
}