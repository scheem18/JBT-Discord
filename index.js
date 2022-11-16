const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ],
    partials:[
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.ThreadMember,
        Partials.User
    ],
    presence:{
        activities:[
            {
                name:'Sileo',
                type:'PLAYING',
                url:'https://getsileo.app/'
            }
        ]
    }
});

const { TOKEN } = require('./config');
const { Player } = require("discord-player");
client.player = new Player(client);
client.player.on("trackStart", (queue, track) => queue.metadata.channel.send(`再生開始:**[${track.title}](${track.url})**`));
const fs = require('fs');

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.slashCommands = new Collection();
const commandFiles = fs.readdirSync('./interactions/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./interactions/commands/${file}`);
    client.slashCommands[command.data.name] = command;
}

client.login(TOKEN).catch(console.error);