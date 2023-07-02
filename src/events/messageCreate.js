const { Events } = require('discord.js');
const replaceLink = require('../utils/linkReplacer.js');
const EmbedMode = require('../utils/embedMode.js');
const { getGuildMode } = require('../utils/db.js');


module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        if (!message.author.bot) {
            const { fullMessage, links } = replaceLink(message.content);
            if (links.length > 0) {
                getGuildMode(message.guildId, (mode) => {
                    if (mode == EmbedMode.REPLACE) {
                        message.delete();
                        message.channel.send(`${message.author}: ${fullMessage}`);
                    }
                    else if (mode == EmbedMode.REPLY) {
						message.reply(links.join('\n'));
                    }
                    else {
                        // Do nothing
                    }
                });
            }
        }
    },
};