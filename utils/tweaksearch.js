const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { MessageEmbedControl } = require('../library/embed-controller');

module.exports = {
    search: async (message, query) => {
        try {
            await message.channel.sendTyping();
            const controller = new MessageEmbedControl(message);
            const results = []
            const { data } = await axios.get(`https://api.canister.me/v2/jailbreak/package/search?q=${query}&limit=250`);
            if (!data.count <= 0) return await message.reply({content:`${query}に一致するパッケージが見つかりませんでした。`});
            data.data.forEach((pkg) => {
                if (results.findIndex(result => (result.package === pkg.package)) === -1) {
                    results.push(pkg);
                }
            });
            const embeds = results.map(pkg => {
                let color = parseInt(pkg.tintColor?.replace('#',""),16);
                if (isNaN(color)) {
                    color = null;
                }
                return new EmbedBuilder()
                .setAuthor({name:`${pkg.repository.name} | Powered by Canister`,iconURL:`${pkg.repository.uri}/CydiaIcon.png`,url:`${pkg.repository.uri}`})
                .setTitle(pkg.name ?? pkg.package)
                .setDescription(pkg.description?.length > 4096 ? pkg.description.slice(0,4096) : pkg.description)
                .setThumbnail(pkg.icon?.startsWith('file://') ? null : pkg.icon)
                .setColor(color)
                .addFields(
                    {name:'パッケージID',value:pkg.package},
                    {name:'作成者',value:`${pkg.author}`,inline:true},
                    {name:'バージョン',value:`${pkg.version}`,inline:true},
                    {name:'セクション',value:pkg.section,inline:true},
                    {name:'リポジトリ',value:`[${pkg.repository.name}](${pkg.repository.uri})`,inline:true},
                    {name:'価格',value:pkg.price,inline:true}
                );
            });
            await controller.reply(embeds);
        } catch (err) {
            console.error(err);
            return await message.reply({content:'パッケージを取得出来ませんでした。'});
        }
    }
}