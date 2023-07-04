const { Events } = require('discord.js');
const { handleMessageLink } = require('../utils/handleLinkResponse.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (!message.author.bot) {
			handleMessageLink(message);
		}
	},
};
