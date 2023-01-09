const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const google = require('googlethis');
const { InteractionEmbedControl } = require('../../library/embed-controller');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('検索ず')
    .addSubcommand(subcmd => 
        subcmd.setName('tweaks')
        .setDescription('tweakを検索')
        .addStringOption(option =>
            option.setName('query')
            .setDescription('検索したいパッケージ名を入力')
            .setRequired(true)
        ))
    .addSubcommand(subcmd =>
        subcmd.setName('repos')
        .setDescription('リポジトリを検索')
        .addStringOption(option =>
            option.setName('query')
            .setDescription('検索したいリポジトリ名を入力')
            .setRequired(true)
        ))
    .addSubcommand(subcmd =>
        subcmd.setName('google')
        .setDescription('Google検索')
        .addStringOption(option =>
            option.setName('query')
            .setDescription('検索したいワードを入力')
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName('safe')
            .setDescription('セーフブラウジング'))
        .addBooleanOption(option =>
            option.setName('ghost')
            .setDescription('検索結果をあなただけに表示'))
        ),
    run: async ({ interaction }) => {
        const query = interaction.options.getString('query');
        if (interaction.options.getSubcommand() === 'tweaks') {
            await interaction.deferReply();
            const controller = new InteractionEmbedControl(interaction);
            try {
                const results = []
                const { data } = await axios.get(`https://api.canister.me/v2/jailbreak/package/search?q=${query}&limit=250`);
                if (data.count <= 0) return await message.reply({content:`${query}に一致するパッケージが見つかりませんでした。`});
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
                await controller.reply(embeds, {deferred:true});
            } catch (err) {
                console.error(err);
                return await interaction.editReply({content:'パッケージを取得出来ませんでした。'});
            }
        } else if (interaction.options.getSubcommand() === 'repos') {
            await interaction.deferReply();
            try {
                const repo = (await (axios.get(`https://api.canister.me/v2/jailbreak/repository/search?q=${query}`))).data.data[0];
                if (!repo) return await interaction.editReply({content:'リポジトリが見つかりませんでした。'});
                const embed = new EmbedBuilder()
                .setTitle(`${repo.name}`)
                .setURL(repo.uri)
                .setDescription(`${repo.description}` ?? null)
                .setThumbnail(`${repo.uri}/CydiaIcon.png`)
                .addFields(
                    {name:'パッケージ数',value:`${repo.packageCount}`,inline:true},
                    {name:'バージョン',value:`${repo.version}`,inline:true}
                )
                .setFooter({text:'Powered by canister.me'})
                await interaction.editReply({embeds:[embed]});
            } catch (err) {
                console.error(err);
                return await interaction.editReply({content:'リポジトリを取得出来ませんでした。'});
            }
        } else if (interaction.options.getSubcommand() === 'google') {
            const isSafe = interaction.options.getBoolean('safe');
            const isGhost = interaction.options.getBoolean('ghost');
            await interaction.deferReply({ephemeral:isGhost});
            try {
                const { results, did_you_mean } = await google.search(query,{page:0,safe:!isSafe ? true : isSafe,additional_params:{hl:'ja'}});
                while (results.length > 5) {
                  results.pop();
                }
                let result = [];
                results.map((res) => result.push(`[${res.title}](${res.url})`));
                if (!result[0]) return await interaction.editReply({content:'このワードに一致する情報は見つかりませんでした。'});
                const embed = new EmbedBuilder()
                .setTitle(`${query.length < 32 ? query : `${query.slice(0,32)}...`}の検索結果`)
                .setURL(`${`https://google.com/search?q=${encodeURIComponent(query)}`}`)
                .setDescription(`${did_you_mean ? `**もしかして:${did_you_mean}**\n` : ''}${result.join('\n')}`)
                .setColor('6efc6a')
                .setFooter({text:'Powered by Google',iconURL:'https://cdn.discordapp.com/attachments/969143655262720030/1033689269673402408/unknown.png'})
                .setTimestamp();
                await interaction.editReply({embeds:[embed]});
            } catch (err) {
                console.error(err);
                await interaction.editReply({content:'検索出来ませんでした。'});
            }
        }
    }
}