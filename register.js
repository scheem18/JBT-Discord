const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
require('dotenv').config();
const fs = require("fs");

const commands = [];
const commandFiles = fs
  .readdirSync("./interactions/commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./interactions/commands/${file}`);
  commands.push(command.data.toJSON());
}
const contextFiles = fs
  .readdirSync("./interactions/contexts/")
  .filter((file) => file.endsWith(".js"));
for (const file of contextFiles) {
  const contexts = require(`./interactions/contexts/${file}`);
  commands.push(contexts.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env['TOKEN']);

(async () => {
  try {
    console.log("スラッシュコマンド登録");
    await rest.put(
      Routes.applicationCommands(process.env['ID']),
      { body: commands }
    );
  } catch (err) {
    console.error(err);
  }
})();