const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { handleContextMenuArchive } = require('../../../utils/handleLinkResponse.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Archive')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		await handleContextMenuArchive(interaction);
	},
};
