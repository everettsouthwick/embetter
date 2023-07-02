const { Events } = require('discord.js');
const replaceLink = require('../utils/linkReplacer.js');
const EmbedMode = require('../utils/embedMode.js');
const { getGuildMode } = require('../utils/db.js');


module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (!message.author.bot) {
			getGuildMode(message.guildId, (mode) => {
				if (mode == EmbedMode.REPLACE) {
					const newMessage = replaceLink(message.content);
					if (newMessage != message.content) {
						message.delete();
						message.channel.send(`${message.author}: ${newMessage}`);
					}
				}
				else if (mode == EmbedMode.REPLY) {
					const newMessage = replaceLink(message.content);
					if (newMessage != message.content) {
						message.reply(newMessage);
					}
				}
				else {
					// Do nothing
				}
			});
		}
	},
};