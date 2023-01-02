module.exports = {
	name: 'trackStart',
	player: true,
	execute: async (queue, track) => {
        queue.metadata.channel.send({embeds:[
            {
                author:{name:'再生開始'},
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
        ]});
    }
}