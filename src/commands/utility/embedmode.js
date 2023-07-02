const { SlashCommandBuilder } = require('discord.js');
const { setGuildMode } = require('../../utils/db.js');
const EmbedMode = require('../../utils/embedMode.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embedmode')
		.setDescription('Sets the embed mode.')
		.addIntegerOption(option => option
			.setName('embedmode')
			.setDescription('The embed mode.')
			.setRequired(true)
			.addChoices(
				{ name: 'Replace', value: EmbedMode.REPLACE },
				{ name: 'Reply', value: EmbedMode.REPLY },
				{ name: 'Manual', value: EmbedMode.MANUAL },
			)),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await setGuildMode(interaction.guild.id, interaction.options.getInteger('embedmode'));
		await interaction.reply(`You have selected ${EmbedMode.getModeName(interaction.options.getInteger('embedmode'))}.`);
	},
};