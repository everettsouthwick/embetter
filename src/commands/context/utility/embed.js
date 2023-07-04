const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const replaceLink = require('../../../utils/linkReplacer.js');
const { handleContextMenuLink } = require('../../../utils/handleLinkMessage.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Embed')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
		await handleContextMenuLink(interaction)
	},
};
