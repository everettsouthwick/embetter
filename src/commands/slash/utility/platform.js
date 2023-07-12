const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Mode } = require('../../../models/mode.js');
const { GuildProfile } = require('../../../models/guildProfile.js');
const { getRepositories } = require('../../../utils/db.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('platform')
        .setDescription('Configure the platforms.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Sets the platform for embeds. By default, they are enabled.')
                .addStringOption(option => option
                    .setName('platform')
                    .setDescription('Website platform.')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Instagram', value: 'Instagram' },
                        { name: 'Threads', value: 'Threads' },
                        { name: 'TikTok', value: 'TikTok' },
                        { name: 'Twitter', value: 'Twitter' },
                        { name: 'The Atlantic', value: 'The Atlantic' },
                        { name: 'Bloomberg', value: 'Bloomberg' },
                        { name: 'The New York Times', value: 'The New York Times' },
                        { name: 'Rolling Stone', value: 'Rolling Stone' },
                        { name: 'The Wall Street Journal', value: 'The Wall Street Journal' },
                        { name: 'The Washington Post', value: 'The Washington Post' },
                    ))
                .addBooleanOption(option => option
                    .setName('enable')
                    .setDescription('Enable or disable the platform.')
                    .setRequired(true)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lists the platforms and their status.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'set') {
            const repositories = getRepositories();
            const guildRepository = repositories.guildRepository;

            const platform = interaction.options.getString('platform');
            const isEnabled = interaction.options.getBoolean('enable');

            let guildProfile = await guildRepository.getGuildProfile(interaction.guild.id);
            if (guildProfile) {
                guildProfile.platforms = guildProfile.platforms || {};
                guildProfile.platforms[platform] = isEnabled;
            } else {
                guildProfile = new GuildProfile(interaction.guild.id, Mode.ASK, { [platform]: isEnabled });
            }

            await guildRepository.setGuildProfile(guildProfile);

            await interaction.reply({ content: `The platform ${platform} has been set to ${isEnabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
        }
        else if (interaction.options.getSubcommand() === 'list') {
            const repositories = getRepositories();
            const guildRepository = repositories.guildRepository;

            const guildProfile = await guildRepository.getGuildProfile(interaction.guild.id);
            if (!guildProfile) {
                await interaction.reply({ content: 'No platforms have been set.', ephemeral: true });
            }
            else {
                const platforms = guildProfile.platforms || {};
                const platformList = Object.keys(platforms).map(platform => `${platform}: ${platforms[platform] ? ':white_check_mark:' : ':x:'}`).join('\n');
                // Make an embed of all the enabled and disabled platforms
                const embed = new EmbedBuilder()
                    .setTitle('Platforms')
                    .addFields(
                        {
                            name: "Enabled",
                            value: Object.keys(platforms).map(platform => platforms[platform] ? platform : ``).join(`\n`),
                        },
                        {
                            name: "Disabled",
                            value: Object.keys(platforms).map(platform => !platforms[platform] ? platform : ``).join(`\n`),
                        },
                    )
                    .setColor('#0a84ff')
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    },

};