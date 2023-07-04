const { Events } = require('discord.js');
const { handleMessageLink } = require('../utils/handleLinkMessage.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (!message.author.bot) {
            handleMessageLink(message);
		}
	},
};
