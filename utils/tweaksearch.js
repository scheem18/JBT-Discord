const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    search: async (message, query) => {
        try {
            await message.sendTyping;
            const pkg = (await (axios.get(`https://api.canister.me/v2/jailbreak/package/search?q=${query}`))).data.data[0];
            if (!pkg) return await message.reply({content:'パッケージが見つかりませんでした。'});
            const repo = (await (axios.get(`${pkg.refs.repo}`))).data.data;
            const embed = new EmbedBuilder()
            .setAuthor({name:`${repo.name}`,iconURL:`${repo.uri}/CydiaIcon.png`,url:`${repo.uri}`})
            .setTitle(pkg.name ?? pkg.package)
            .setDescription(`${pkg.description.length > 4000 ? pkg.description.slice(0,4000) : pkg.description}` ?? null)
            .setThumbnail(pkg.icon?.startsWith('file://') ? null : pkg.icon ?? null)
            .addFields(
                {name:'パッケージID',value:pkg.package},
                {name:`作成者`,value:`${pkg.author}`,inline:true},
                {name:'バージョン',value:`${pkg.version}`,inline:true},
                {name:'リポジトリ',value:`[${repo.name}](${repo.uri})`,inline:true},
                {name:'価格',value:pkg.price,inline:true},
                {name:'カテゴリー',value:pkg.section,inline:true},
            )
            .setFooter({text:'Powered by canister.me'})
            await message.reply({embeds:[embed]});
        } catch (err) {
            console.error(err);
            return await message.reply({content:'パッケージを取得出来ませんでした。'});
        }
    }
}