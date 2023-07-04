const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const replaceLink = require('./linkReplacer.js');
const { getGuildMode } = require('./db.js');
const EmbedMode = require('./embedMode.js');

const sendReplaceModeMessage = async (message, fullMessage) => {
    message.delete();
    message.channel.send(`${message.author}: ${fullMessage}`);
};

const sendReplyModeMessage = async (message, links) => {
    const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Delete')
        .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('No')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(confirm, cancel);

    const response = await message.reply({ content: links.join('\n'), components: [row] })

    const collectorFilter = i => i.user.id === message.author.id;

    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

        await confirmation.update({ components: [] });

        if (confirmation.customId === 'confirm') {
            await response.delete();
        }
    } catch (e) {
        // Do nothing
    }
};

const sendManualModeMessage = async (message, links) => {
    const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Primary);

    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('No')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(confirm, cancel);

    const response = await message.reply({ content: `Would you like to embed this link?`, components: [row] })

    const collectorFilter = i => i.user.id === message.author.id;

    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
        if (confirmation.customId === 'confirm') {
            sendReplyModeMessage(message, links);
            await confirmation.update({ components: [] });
            await response.delete();
        } else if (confirmation.customId === 'cancel') {
            await confirmation.update({ components: [] });
            await response.delete();
        }
    } catch (e) {
        await response.edit({ components: [] });
        await response.delete();
    }
};

const handleLinkMessage = async (message) => {
    const { fullMessage, links } = replaceLink(message.content);
    if (links.length > 0) {
        getGuildMode(message.guildId, async (mode) => {
            if (mode == EmbedMode.REPLACE) {
                sendReplaceModeMessage(message, fullMessage);
            }
            else if (mode == EmbedMode.REPLY) {
                sendReplyModeMessage(message, links);
            }
            else {
                sendManualModeMessage(message, links);
            }
        });
    }
}

module.exports = { 
    sendReplyModeMessage, 
    handleLinkMessage 
};