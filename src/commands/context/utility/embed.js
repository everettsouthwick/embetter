const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const replaceLink = require('../../../utils/linkReplacer.js');
const { sendReplyModeMessage } = require('../../../utils/handleLinkMessage.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Embed')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
		const { links } = replaceLink(interaction.targetMessage.content);
		if (links.length > 0) {
			sendReplyModeMessage(interaction.targetMessage, links);
		}
		else {
			interaction.reply('No valid link was found.');
		}
	},
};
