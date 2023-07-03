const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const replaceLink = require('../../../utils/linkReplacer.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Embed')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
		const { links } = replaceLink(interaction.targetMessage.content);
		if (links.length > 0) {
			// If there are multiple links, join them with a newline for readability
			interaction.reply(links.join('\n'));
		}
		else {
			interaction.reply('No valid link was found.');
		}
	},
};
