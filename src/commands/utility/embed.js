const { SlashCommandBuilder } = require('discord.js');
const replaceLink = require('../../utils/linkReplacer.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Attempts to embed the provided link.')
		.addStringOption(option => option
			.setName('link')
			.setDescription('The link to embed.')
			.setRequired(true)),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		const newLink = replaceLink(interaction.options.getString('link'));
		if (newLink != interaction.options.getString('link')) {
			interaction.reply(newLink);
		}
		else {
			interaction.reply('No valid link was found.');
		}
	},
};