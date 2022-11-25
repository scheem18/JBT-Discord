console.log(process.env)
const translateMessages = require('./translateMessages');
const PORT = process.env['PORT'] || 3000
const app = require('express')()
.get('/',(req,res) => {
    return res.json({
        message:'online'
    })
})
.get('/translateMessages',(req,res) => {
    const id = req.query.id;
    const targetLang = req.query.targetLang;
    if (!id || !targetLang) {
        return res.json({
            status:'error',
            message:'パラメーターが不足しています。'
        });
    } else if (!translateMessages[id]) {
        return res.json({
            status:'error',
            message:'指定したIDのメッセージが見つかりませんでした'
        });
    } else if (!translateMessages[id][targetLang]) {
        return res.json({
            status:'error',
            message:'指定したIDのメッセージが見つからないか、指定した言語で翻訳されていません。'
        })
    } else {
        res.send(translateMessages[id][targetLang].content)
    }
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
    }
});
const cron = require('node-cron');
require('./utils/sigscheck').sigscheck();
cron.schedule('0 0,12 * * *', () => {
    require('./utils/sigscheck').sigscheck();
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

client.contextMenus = new Collection();
const contextFiles = fs.readdirSync('./interactions/contexts').filter(file => file.endsWith('.js'));
for (const file of contextFiles) {
    const context = require(`./interactions/contexts/${file}`);
    client.contextMenus[context.data.name] = context;
}

client.login(TOKEN).catch(console.error);