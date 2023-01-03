const { Collection } = require('discord.js');
const emojiList = ['◀️','▶️','🗑'];

module.exports = {
    InteractionEmbedControl: class {
        constructor (interaction) {
            this.interaction = interaction;
            this.embeds = new Collection();
        }
        async setEmbeds (embeds) {
            embeds.forEach(embed => this.embeds.set(this.embeds.size,embed));
            return this;
        }
        async reply (options = {}) {
            const deferred = options.deferred || false;
            const embeds = this.embeds;
            let page = 0;
            const reply = deferred ? await this.interaction.editReply({embeds:[embeds.first().setFooter({text:`${page+1}/${embeds.size}ページ目`})]}) : await this.interaction.reply({embeds:[embeds.first().setFooter({text:`${page+1}/${embeds.size}ページ目`})]});
            for (const emoji of emojiList) await reply.react(emoji);
            const reactionCollector = reply.createReactionCollector(
                (reaction, user) => emojiList.includes(reaction.emoji.name) && user.id === this.interaction.user.id,
                {time:900000}
            );
            reactionCollector.on('collect', async (reaction) => {
                reaction.users.remove(this.interaction.user.id).catch(()=>{});
                switch (reaction.emoji.name) {
                    case emojiList[0]:
                        page = page > 0 ? --page : embeds.size - 1;
                        break;
                    case emojiList[1]:
                        page = page + 1 < embeds.size ? ++page : 0;
                        break;
                    case emojiList[2]:
                        await this.interaction.deleteReply().catch(()=>{});
                        break;
                    default:
                        break;
                }
                this.interaction.editReply({embeds:[embeds.get(page).setFooter({text:`${page+1}/${embeds.size}ページ目`})]}).catch(()=>{});
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
            this.embeds = new Collection;
        }
        async setEmbeds (embeds) {
            embeds.forEach(embed => this.embeds.set(this.embeds.size,embed));
            return this;
        }
        async reply (options = {}) {
            const embeds = this.embeds;
            let page = 0;
            const reply = await this.message.reply({embeds:[embeds.first().setFooter({text:`${page+1}/${embeds.size}ページ目`})]});
            for (const emoji of emojiList) await reply.react(emoji);
            const reactionCollector = reply.createReactionCollector(
                (reaction, user) => emojiList.includes(reaction.emoji.name) && user.id === this.message.author.id,
                {time:900000}
            );
            reactionCollector.on('collect', async (reaction) => {
                reaction.users.remove(this.message.author.id).catch(()=>{});
                switch (reaction.emoji.name) {
                    case emojiList[0]:
                        page = page > 0 ? --page : embeds.size - 1;
                        break;
                    case emojiList[1]:
                        page = page + 1 < embeds.size ? ++page : 0;
                        break;
                    case emojiList[2]:
                        await reply.delete().catch(()=>{});
                        break;
                    default:
                        break;
                }
                reply.edit({embeds:[embeds.get(page).setFooter({text:`${page+1}/${embeds.size}ページ目`})]}).catch(()=>{});
            });
            reactionCollector.on('end', () => {
                if (!reply.deleted) {
                    reply.reactions.removeAll().catch(()=>{});
                }
            });
        }
    }
}