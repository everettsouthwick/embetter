const { Events } = require('discord.js');
const replaceLink = require('../utils/linkReplacer.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (!message.author.bot) {
			const newMessage = replaceLink(message.content);
			if (newMessage != message.content) {
				message.delete();
				message.channel.send(`${message.author}: ${newMessage}`);
			}
		}
	},
};