const { Events } = require('discord.js');
const { handleLinkMessage } = require('../utils/handleLinkMessage.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (!message.author.bot) {
            handleLinkMessage(message);
		}
	},
};
