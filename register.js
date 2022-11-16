const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { TOKEN, ID } = require('./config');
const fs = require("fs");

const commands = [];
const commandFiles = fs
  .readdirSync("./interactions/commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./interactions/commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("スラッシュコマンド登録");
    await rest.put(
      Routes.applicationCommands(
        ID
      ),
      { body: commands }
    );
  } catch (err) {
    console.error(err);
  }
})();