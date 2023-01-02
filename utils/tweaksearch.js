const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { MessageEmbedControl } = require('../library/embed-controller');

module.exports = {
    search: async (message, query) => {
        try {
            await message.channel.sendTyping();
            const controller = new MessageEmbedControl(message);
            const pkgs = (await (axios.get(`https://api.canister.me/v1/community/packages/search?query=${encodeURIComponent(query)}&searchFields=name,identifier,description&limit=5&responseFields=*,repository.name,repository.uri`))).data.data;
            if (!pkgs[0]) return await message.reply({content:`${query}に一致するパッケージが見つかりませんでした。`});
            const embeds = [];
            pkgs.forEach(pkg => {
                let color = parseInt(pkg.tintColor?.replace('#',""),16);
                if (isNaN(color)) {
                    color = null;
                }
                embeds.push(
                    new EmbedBuilder()
                    .setAuthor({name:`${pkg.repository.name} | Powered by Canister`,iconURL:`${pkg.repository.uri}/CydiaIcon.png`,url:`${pkg.repository.uri}`})
                    .setTitle(pkg.name ?? pkg.identifier)
                    .setDescription(`${pkg.description.length > 4000 ? pkg.description.slice(0,4000) : pkg.description}` ?? null)
                    .setThumbnail(pkg.packageIcon?.startsWith('file://') ? null : pkg.packageIcon)
                    .setColor(color)
                    .addFields(
                        {name:'パッケージID',value:pkg.identifier},
                        {name:'作成者',value:`${pkg.author}`,inline:true},
                        {name:'バージョン',value:`${pkg.latestVersion}`,inline:true},
                        {name:'リポジトリ',value:`[${pkg.repository.name}](${pkg.repository.uri})`,inline:true},
                        {name:'価格',value:pkg.price,inline:true}
                    )
                )
            });
            await controller.setEmbeds(embeds);
            await controller.reply();
        } catch (err) {
            console.error(err);
            return await message.reply({content:'パッケージを取得出来ませんでした。'});
        }
    }
}