const emojiList = ['◀️','▶️','🗑'];

module.exports = {
    InteractionEmbedControl: class {
        constructor (interaction) {
            this.interaction = interaction;
        }
        async reply (embeds, options = {}) {
            const deferred = options.deferred || false;
            let page = 0;
            const reply = deferred ? await this.interaction.editReply({embeds:[embeds[0].setFooter({text:`${page+1}/${embeds.length}ページ目`})]}) : await this.interaction.reply({embeds:[embeds[0].setFooter({text:`${page+1}/${embeds.length}ページ目`})]});
            for (const emoji of emojiList) await reply.react(emoji);
            const filter = (reaction,user) => {
                return user.id === this.interaction.user.id;
            };
            const reactionCollector = reply.createReactionCollector({filter, time:900000});
            reactionCollector.on('collect', async (reaction) => {
                reaction.users.remove(this.interaction.user.id).catch(()=>{});
                switch (reaction.emoji.name) {
                    case emojiList[0]:
                        page = page > 0 ? --page : embeds.length - 1;
                        break;
                    case emojiList[1]:
                        page = page + 1 < embeds.length ? ++page : 0;
                        break;
                    case emojiList[2]:
                        await this.interaction.deleteReply().catch(()=>{});
                        break;
                    default:
                        break;
                }
                this.interaction.editReply({embeds:[embeds[page].setFooter({text:`${page+1}/${embeds.length}ページ目`})]}).catch(()=>{});
            });
            reactionCollector.on('end', () => {
                if (!reply.deleted) {
                    reply.reactions.removeAll().catch(()=>{});
                }
            });
        }
    },
    MessageEmbedControl: class {
        constructor (message) {
            this.message = message;
        }
        async reply (embeds, options = {}) {
            let page = 0;
            const reply = await this.message.reply({embeds:[embeds[0].setFooter({text:`${page+1}/${embeds.length}ページ目`})]});
            for (const emoji of emojiList) await reply.react(emoji);
            const filter = (reaction,user) => {
                return user.id === this.message.author.id;
            };
            const reactionCollector = reply.createReactionCollector({filter, time:900000});
            reactionCollector.on('collect', async (reaction) => {
                reaction.users.remove(this.message.author.id).catch(()=>{});
                switch (reaction.emoji.name) {
                    case emojiList[0]:
                        page = page > 0 ? --page : embeds.length - 1;
                        break;
                    case emojiList[1]:
                        page = page + 1 < embeds.length ? ++page : 0;
                        break;
                    case emojiList[2]:
                        await reply.delete().catch(()=>{});
                        break;
                    default:
                        break;
                }
                reply.edit({embeds:[embeds[page].setFooter({text:`${page+1}/${embeds.length}ページ目`})]}).catch(()=>{});
            });
            reactionCollector.on('end', () => {
                if (!reply.deleted) {
                    reply.reactions.removeAll().catch(()=>{});
                }
            });
        }
    }
}