const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setGuildMode } = require('../../utils/db.js');
const EmbedMode = require('../../utils/embedMode.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embedmode')
		.setDescription('Sets the mode for embeds. By default, this is set to manual.')
		.addIntegerOption(option => option
			.setName('embedmode')
			.setDescription('Replace: Delete and resend, Reply: Keep and send, Manual: Do nothing.')
			.setRequired(true)
			.addChoices(
				{ name: 'Replace', value: EmbedMode.REPLACE },
				{ name: 'Reply', value: EmbedMode.REPLY },
				{ name: 'Manual', value: EmbedMode.MANUAL },
			))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		setGuildMode(interaction.guild.id, interaction.options.getInteger('embedmode'));
		await interaction.reply({ content: `You have selected ${EmbedMode.getModeName(interaction.options.getInteger('embedmode'))}.`, ephemeral: true });
	},
};