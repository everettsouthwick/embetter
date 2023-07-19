const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('platform')
		.setDescription('Configure the platforms.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('set')
				.setDescription('Sets the platform for embeds. By default, they are enabled.')
				.addStringOption((option) => option
					.setName('platform')
					.setDescription('Website platform.')
					.setRequired(true)
					.addChoices(
						{ name: 'Instagram', value: 'Instagram' },
						{ name: 'Threads', value: 'Threads' },
						{ name: 'TikTok', value: 'TikTok' },
						{ name: 'Twitter', value: 'Twitter' },
						{ name: 'Bluesky', value: 'Bluesky' },
						{ name: 'The Atlantic', value: 'The Atlantic' },
						{ name: 'Bloomberg', value: 'Bloomberg' },
						{ name: 'The New York Times', value: 'The New York Times' },
						{ name: 'Rolling Stone', value: 'Rolling Stone' },
						{ name: 'The Wall Street Journal', value: 'The Wall Street Journal' },
						{ name: 'The Washington Post', value: 'The Washington Post' },
					))
				.addBooleanOption((option) => option
					.setName('enable')
					.setDescription('Enable or disable the platform.')
					.setRequired(true),
				))
		.addSubcommand((subcommand) =>
			subcommand
				.setName('list')
				.setDescription('Lists the platforms and their status.'))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false),
	async execute(interaction) {
		const guildProfileService = interaction.client.guildProfileService;

		if (interaction.options.getSubcommand() === 'set') {
			const platform = interaction.options.getString('platform');
			const isEnabled = interaction.options.getBoolean('enable');

			await guildProfileService.setPlatform(interaction.guild.id, platform, isEnabled);
			await interaction.reply({ content: `The platform ${platform} has been set to ${isEnabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
		}
		else if (interaction.options.getSubcommand() === 'list') {
			const embed = await guildProfileService.getPlatformListEmbed(interaction.guild.id);
			await interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},

};
