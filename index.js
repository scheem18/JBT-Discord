const PORT = process.env['PORT'] || 3000
require('express')()
.get('/',(req,res) => {
    return res.json({
        message:'online'
    })
})
.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});

const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require('discord.js');
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
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
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
                type:ActivityType.Playing,
                url:'https://getsileo.app/'
            }
        ]
    },
    allowedMentions:{
        repliedUser:false
    }
});

require('dotenv').config();
setInterval(() => {
    require('./utils/sigscheck').sigscheck(client);
},43200000);
const { Player } = require("discord-player");
client.player = new Player(client);
const fs = require('fs');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else if (event.player) {
        client.player.on(event.name, (...args) => event.execute(...args, client));
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

client.contextMenus = new Collection();
const contextFiles = fs.readdirSync('./interactions/contexts').filter(file => file.endsWith('.js'));
for (const file of contextFiles) {
    const context = require(`./interactions/contexts/${file}`);
    client.contextMenus[context.data.name] = context;
}

client.autoComplete = new Collection();
const autoCompleteFiles = fs.readdirSync('./interactions/autocomplete').filter(file => file.endsWith('.js'));
for (const file of autoCompleteFiles) {
    const autocomplete = require(`./interactions/autocomplete/${file}`);
    client.autoComplete[autocomplete.data.name] = autocomplete;
}

client.login(process.env['TOKEN']).catch(console.error);