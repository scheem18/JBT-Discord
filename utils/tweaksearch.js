const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    search: async (message, query) => {
        try {
            await message.sendTyping;
            const pkg = (await (axios.get(`https://api.canister.me/v1/community/packages/search?query=${encodeURIComponent(query)}&limit=1&responseFields=name,description,author,price,packageIcon,depiction,repository.name,repository.uri,latestVersion,identifier`))).data.data[0];
            if (!pkg) return await message.reply({content:'パッケージが見つかりませんでした。'});
            const embed = new EmbedBuilder()
            .setAuthor({name:`${pkg.repository.name}`,iconURL:`${pkg.repository.uri}/CydiaIcon.png`,url:`${pkg.repository.uri}`})
            .setTitle(pkg.name ?? pkg.identifier)
            .setDescription(`${pkg.description.length > 4000 ? pkg.description.slice(0,4000) : pkg.description}` ?? null)
            .setThumbnail(pkg.packageIcon?.startsWith('file://') ? null : pkg.packageIcon)
            .addFields(
                {name:'パッケージID',value:pkg.identifier},
                {name:'作成者',value:`${pkg.author}`,inline:true},
                {name:'バージョン',value:`${pkg.latestVersion}`,inline:true},
                {name:'リポジトリ',value:`[${pkg.repository.name}](${pkg.repository.uri})`,inline:true},
                {name:'価格',value:pkg.price,inline:true}
            )
            .setFooter({text:'Powered by canister.me'})
            await message.reply({embeds:[embed]});
        } catch (err) {
            console.error(err);
            return await message.reply({content:'パッケージを取得出来ませんでした。'});
        }
    }
}