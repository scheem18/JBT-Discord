const emojilist = ['◀️','▶️','🗑'];
module.exports = { 
    interaction: {
        editReply: async ({interaction,embeds}) => {
            if (embeds.length === 1) {
                return await interaction.editReply({embeds:[embeds[0]]});
            }
            const reply = await interaction.editReply({embeds:[embeds[0].setFooter({text:`1/${embeds.length}ページ目`})]});
            await editPages({reply,interaction,embeds});
        },
        reply: async ({interaction,embeds}) => {
            if (embeds.length === 1) {
                return await interaction.reply({embeds:[embeds[0]]});
            }
            const reply = await interaction.reply({embeds:[embeds[0].setFooter({text:`1/${embeds.length}ページ目`})]});
            await editPages({reply,interaction,embeds});
        }
    },
    message: {
        reply: async ({message,embeds}) => {
            if (embeds.length === 1) {
                return await message.reply({embeds:[embeds[0]]});
            }
            const reply = await message.reply({embeds:[embeds[0].setFooter({text:`1/${embeds.length}ページ目`})]});
            await editPages({reply,message,embeds});
        }
    }
}

async function editPages ({reply,interaction,embeds,message}) {
    emojilist.map(emojis => reply.react(emojis));
    const userId = interaction ? interaction.user.id : message.author.id;
    const filter = (reaction,user) => {
        return user.id === userId;
    };
    const collector = reply.createReactionCollector({ filter, time: 900000 });
    let pages = 0;
    collector.on('collect',async (reaction) => {
        reply.reactions.cache.get(reaction.emoji.name).users.remove(userId).catch(() => {});
        switch (reaction.emoji.name) {
            case emojilist[0]:
                pages = pages > 0 ? --pages : embeds.length - 1;
                break;
            case emojilist[1]:
                pages = pages + 1 < embeds.length ? ++pages : 0;
                break;
            case emojilist[2]:
                if (message) {
                    await reply.delete().catch(console.error);
                } else {
                    await interaction.deleteReply().catch(console.error);
                }
                break;
            default:
                break;
        }
        if (message) {
            await reply.edit({embeds:[embeds[pages].setFooter({text:`${pages+1}/${embeds.length}ページ目`})]}).catch(console.error);
        } else {
            await interaction.editReply({embeds:[embeds[pages].setFooter({text:`${pages+1}/${embeds.length}ページ目`})]}).catch(console.error);
        }
    });
    collector.on('end', () => {
      reply.reactions.removeAll().catch(() => {})
    });
}