// path/to/your/command/files/help.js

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays the help page.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel)
		.setDMPermission(true),
	async execute(interaction) {
		const privacyPolicyLink = 'https://github.com/everettsouthwick/embetter/blob/main/PRIVACY.md';

		const helpMessage = `
**Embetter help information**

1. **/archive**: Attempts to embed and archive the provided link(s).
    - Option: \`link\` (required) - Space separated list of link(s) to embed.

2. **/embed**: Attempts to embed the provided link(s).
    - Option: \`link\` (required) - Space separated list of link(s) to embed.

3. **/mode**: Configure the embed mode.
    - Subcommand: \`set\` - Sets the mode for embeds. Options: Replace, Reply, Ask, Manual.

4. **/platform**: Configure the platforms.
    - Subcommand: \`set\` - Sets the platform for embeds. Choices: Instagram, Threads, TikTok, etc.
    - Subcommand: \`list\` - Lists the platforms and their status.

View our [privacy policy](<${privacyPolicyLink}>) for data retention and privacy information.
`;

		await interaction.reply({ content: helpMessage, ephemeral: true });
	},
};
