const { SlashCommandBuilder } = require('discord.js');
const { handleSlashCommandLink } = require('../../../utils/handleLinkResponse.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Attempts to embed the provided link(s).')
		.addStringOption((option) => option
			.setName('link')
			.setDescription('Space separated list of link(s) to embed.')
			.setRequired(true)),
	async execute(interaction) {
		handleSlashCommandLink(interaction);
	},
};
