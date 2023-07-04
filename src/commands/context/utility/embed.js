const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { handleContextMenuLink } = require('../../../utils/handleLinkResponse.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Embed')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		await handleContextMenuLink(interaction);
	},
};
