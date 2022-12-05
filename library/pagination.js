const emojilist = ['◀️','▶️','🗑'];
module.exports = {
    editReply: async ({interaction,embeds}) => {
        const reply = await interaction.editReply({embeds:[embeds[0].setFooter({text:`1/${embeds.length}ページ目`})]});
        await editPages({reply,interaction,embeds})
    },
    reply: async ({interaction,embeds}) => {
        const reply = await interaction.reply({embeds:[embeds[0].setFooter({text:`1/${embeds.length}ページ目`})]});
        await editPages({reply,interaction,embeds});
    }
}

async function editPages ({reply,interaction,embeds}) {
    emojilist.map(emojis => reply.react(emojis));
    const filter = (reaction,user) => {
        return user.id === interaction.user.id;
    };
    const collector = reply.createReactionCollector({ filter, time: 900000 });
    let pages = 0;
    collector.on('collect', (reaction) => {
        reply.reactions.cache.get(reaction.emoji.name).users.remove(interaction.user.id).catch(() => {});
        switch (reaction.emoji.name) {
            case emojilist[0]:
                pages = pages > 0 ? --pages : embeds.length - 1;
                break;
            case emojilist[1]:
                pages = pages + 1 < embeds.length ? ++pages : 0;
                break;
            case emojilist[2]:
                interaction.deleteReply().catch(() => {});
                break;
            default:
                break;
        }
        interaction.editReply({embeds:[embeds[pages].setFooter({text:`${pages+1}/${embeds.length}ページ目`})]}).catch(()=>{});
    });
    collector.on('end', () => {
      reply.reactions.removeAll().catch(() => {})
    });
}