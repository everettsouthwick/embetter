const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Mode } = require('../../../models/mode.js');
const { GuildProfile } = require('../../../models/guildProfile.js');
const { getRepositories } = require('../../../utils/db.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('mode')
		.setDescription('Configure the embed mode.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('set')
				.setDescription('Sets the mode for embeds. By default, this is set to ask.')
				.addIntegerOption(option => option
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
		if (interaction.options.getSubcommand() === 'set') {
			const repositories = getRepositories();
			const guildRepository = repositories.guildRepository;

			let guildProfile = await guildRepository.getGuildProfile(interaction.guild.id);
			if (guildProfile) {
				guildProfile.mode = interaction.options.getInteger('mode');
			}
			else {
				guildProfile = new GuildProfile(interaction.guild.id, interaction.options.getInteger('mode'), {});
			}

			await guildRepository.setGuildProfile(guildProfile);
			await interaction.reply({ content: `The mode has been set to ${Mode.getModeName(interaction.options.getInteger('mode'))}.`, ephemeral: true });
		}
	},
};