const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode } = require("discord-player");
const playdl = require("play-dl");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("音楽ず")
    .addSubcommand(subcommand =>
		subcommand.setName('play')
		.setDescription('ボイスチャンネルで曲を再生')
    .addStringOption(option => 
    option.setName('query')
    .setDescription('urlかタイトル')
    .setRequired(true)
    ))
	  .addSubcommand(subcommand => 
    subcommand.setName('stop')
		.setDescription('再生中の曲を停止し、ボイスチャンネルから切断'))
    .addSubcommand(subcommand =>
		subcommand.setName('skip')
		.setDescription('再生中の曲をスキップ'))
    .addSubcommand(subcommand =>
		subcommand.setName('loop')
		.setDescription('曲をループ')
    .addStringOption(option => 
    option.setName('ループモード')
    .setDescription('ループモードを選択')
    .setRequired(true)
    .addChoices(
      { name: 'オフ', value: 'OFF' },
      { name: '現在の曲のみ', value: 'TRACK' },
      { name: 'キュー内の曲', value: 'QUEUE' },
    )
    ))
    .addSubcommand(subcommand =>
		subcommand.setName('nowplaying')
		.setDescription('再生中の曲を表示'))
    .addSubcommand(subcommand =>
		subcommand.setName('queue')
		.setDescription('キュー内の曲を表示')),

  run: async ({ interaction, client }) => {
    if (!interaction.guild) return interaction.reply({content:'サーバー内で実行してください。'});
    if (interaction.options.getSubcommand() === 'play') {
    if (!interaction.member.voice.channelId) {
      return await interaction.reply({
        content: "ボイスチャンネルに参加してください",
        ephemeral: true,
      });
    }
    
    const queue = client.player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
      async onBeforeCreateStream(track, source, _queue) {
        if (source === "youtube") {
            return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
        }
      }
    });
    
    try {
      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
      }
    } catch {
      queue.destroy();
      return await interaction.reply({
        content: "ボイスチャンネルに参加できませんでした",
        ephemeral: true,
      });
    }
    if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.reply({ content: "botと同じボイスチャンネルに参加してください", ephemeral: true });

    await interaction.deferReply();

    const word = interaction.options.getString("query");
    const track = await client.player.search(word, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
    if (!track) {
      return await interaction.followUp({
        content: "動画が見つかりませんでした",
      });
    }
    await queue.addTrack(track);
    if (!queue.playing) {
      queue.play();
    }
    return await interaction.followUp({
      embeds:[
        {
          author:{nane:'キューに追加'},
          title:`${track.title}`,
          url:`${track.url}`,
          fields:[
            {name:'時間', value:`${track.duration}`, inline:true},
            {name:'チャンネル', value:`${track.author}`, inline:true},
            {name:'再生数', value:`${track.views}`, inline:true}
          ],
          thumbnail:{
            url:track.thumbnail
          }
        }
      ]
    });
    } else if (interaction.options.getSubcommand() === 'stop') {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) {
          return await interaction.reply({
            content: "曲が再生されていません",
            ephemeral: true,
          });
        }
    
        queue.destroy();
    
        await interaction.reply({
          content: "再生を停止しました",
        });
    } else if (interaction.options.getSubcommand() === 'skip') {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "曲が再生されていません" });
        const currentTrack = queue.current;
        const success = queue.skip();
        return void interaction.followUp({
        content: success ? `${currentTrack}をスキップしました` : "エラーが発生しました"
        });
    } else if (interaction.options.getSubcommand() === 'loop') {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "曲が再生されていません" });
          try {
            const mode = interaction.options.getString('ループモード');
            await queue.setRepeatMode(QueueRepeatMode[mode]);
            await interaction.editReply({content:`ループモードを${mode}に変更しました。`});
            } catch (err) {
            interaction.reply('ループモードを変更できませんでした')
          }
    } else if (interaction.options.getSubcommand() === 'nowplaying') {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "音楽が再生されていません" });
        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();
        return void interaction.followUp({
            embeds: [
                {
                  author:{name:'再生中'},
                  title: `${queue.current.title}`,
                  url:`${queue.current.url}`,
                  thumbnail:{url:queue.current.thumbnail},
                  fields: [
                      {
                          name: `${perc.progress}%`,
                          value: progress
                      }
                  ],
                  footer:{text:`${queue.current.requestedBy.tag}が再生`}
                }
            ]
        })
    } else if (interaction.options.getSubcommand() === 'queue') {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "音楽が再生されていません" });
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}:[${m.title}](${m.url})`;
        });
        return void interaction.followUp({
            embeds: [
                {
                    title: "キュー内",
                    description: `${tracks.join("\n")}${
                        queue.tracks.length > tracks.length
                            ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
                            : ""
                    }`,
                    fields:[{name: "再生中", value: `${currentTrack.title}(${currentTrack.url})`}]
                }
            ]
        });
    }
  },
};
