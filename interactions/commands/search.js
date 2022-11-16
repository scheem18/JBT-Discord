const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const google = require('googlethis');
const reactionPagination = require('../../library/pagination');

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
            const embeds = []
            try {
                const { data } = await axios.get(`https://api.canister.me/v2/jailbreak/package/search?q=${query}`);
                if (!data.data[0]) return await interaction.editReply({content:'パッケージが見つかりませんでした。'});
                while (data.data.length > 5) {
                    data.data.pop();
                }
                console.log(data.data)
                data.data.map(x => {
                    embeds.push(
                        new EmbedBuilder()
                        .setTitle(`${x.name ?? 'パッケージ名無し'}`)
                        .setDescription(`${x.description.length > 4000 ? x.description.slice(0,4000) : x.description}` ?? null)
                        .addFields(
                            {name:'パッケージID',value:x.package},
                            {name:'作成者',value:`${x.author}`,inline:true},
                            {name:'バージョン',value:`${x.version}`,inline:true},
                            {name:'リポジトリ',value:x.repositorySlug,inline:true},
                            {name:'価格',value:x.price,inline:true},
                            {name:'カテゴリー',value:x.section,inline:true},
                        )
                    );
                });
                if (embeds.length === 1) return await interaction.editReply({embeds:[embeds[0]]});
                await reactionPagination.editReply({interaction,embeds});
            } catch (err) {
                console.error(err);
                return await interaction.editReply({content:'パッケージを取得出来ませんでした。'});
            }
        } else if (interaction.options.getSubcommand() === 'repos') {
            await interaction.deferReply();
            const embeds = []
            try {
                const { data } = await axios.get(`https://api.canister.me/v2/jailbreak/repository/search?q=${query}`);
                if (!data.data[0]) return await interaction.editReply({content:'リポジトリが見つかりませんでした。'});
                while (data.data.length > 5) {
                    data.data.pop();
                }
                data.data.map(x => {
                    embeds.push(
                        new EmbedBuilder()
                        .setTitle(`${x.slug}`)
                        .setURL(x.uri)
                        .setDescription(`${x.description}` ?? null)
                        .addFields(
                            {name:'パッケージ数',value:`${x.packageCount}`,inline:true},
                            {name:'バージョン',value:`${x.version}`,inline:true}
                        )
                    );
                });
                if (embeds.length === 1) return await interaction.editReply({embeds:[embeds[0]]});
                await reactionPagination.editReply({interaction,embeds});
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