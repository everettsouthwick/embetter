const { SlashCommandBuilder } = require('discord.js');
const { handleSlashCommandArchive } = require('../../../utils/handleLinkResponse.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('archive')
		.setDescription('Attempts to embed and archive the provided link(s).')
		.addStringOption((option) => option
			.setName('link')
			.setDescription('Space separated list of link(s) to embed.')
			.setRequired(true)),
	async execute(interaction) {
		handleSlashCommandArchive(interaction);
	},
};
