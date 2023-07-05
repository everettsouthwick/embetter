const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setGuildMode } = require('../../../utils/db.js');
const EmbedMode = require('../../../models/embedMode.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embedmode')
		.setDescription('Sets the mode for embeds. By default, this is set to ask.')
		.addIntegerOption(option => option
			.setName('mode')
			.setDescription('Replace: Delete and resend, Reply: Keep and send, Ask: Ask the user.')
			.setRequired(true)
			.addChoices(
				{ name: 'Replace', value: EmbedMode.REPLACE },
				{ name: 'Reply', value: EmbedMode.REPLY },
				{ name: 'Ask', value: EmbedMode.ASK },
			))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		setGuildMode(interaction.guild.id, interaction.options.getInteger('mode'));
		await interaction.reply({ content: `You have selected ${EmbedMode.getModeName(interaction.options.getInteger('mode'))}.`, ephemeral: true });
	},
};