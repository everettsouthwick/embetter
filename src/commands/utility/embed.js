const { SlashCommandBuilder } = require('discord.js');
const replaceLink = require('../../utils/linkReplacer.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Attempts to embed the provided link(s).')
		.addStringOption(option => option
			.setName('link')
			.setDescription('Space separated list of link(s) to embed.')
			.setRequired(true)),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		const { links } = replaceLink(interaction.options.getString('link'));
		if (links.length > 0) {
			// If there are multiple links, join them with a newline for readability
			interaction.reply(links.join('\n'));
		}
		else {
			interaction.reply('No valid link was found.');
		}
	},
};
