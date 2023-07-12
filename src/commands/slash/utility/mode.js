const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Mode } = require('../../../models/Mode.js');
const { GuildProfile } = require('../../../models/GuildProfile.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mode')
		.setDescription('Configure the embed mode.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('set')
				.setDescription('Sets the mode for embeds. By default, this is set to ask.')
				.addIntegerOption((option) => option
					.setName('mode')
					.setDescription('Replace: Delete and resend, Reply: Keep and send, Ask: Ask the user.')
					.setRequired(true)
					.addChoices(
						{ name: 'Replace', value: Mode.REPLACE },
						{ name: 'Reply', value: Mode.REPLY },
						{ name: 'Ask', value: Mode.ASK },
						{ name: 'Manual', value: Mode.MANUAL },
					)))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false),
	async execute(interaction) {
		const guildProfileService = interaction.client.guildProfileService;

		if (interaction.options.getSubcommand() === 'set') {
			const mode = interaction.options.getInteger('mode');

			let guildProfile = await guildProfileService.getGuildProfile(interaction.guild.id);
			if (guildProfile) {
				guildProfile.mode = mode;
			}
			else {
				guildProfile = new GuildProfile(interaction.guild.id, mode, {});
			}

			await guildProfileService.upsertGuildProfile(guildProfile);
			await interaction.reply({ content: `The mode has been set to ${Mode.getModeName(mode)}.`, ephemeral: true });
		}
	},
};
