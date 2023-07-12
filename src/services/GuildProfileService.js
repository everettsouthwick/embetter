const { Mode } = require('../models/Mode.js');
const { GuildProfile } = require('../models/GuildProfile.js');
const { EmbedBuilder } = require('discord.js');
const platforms = require('../constants/platforms.js');

class GuildProfileService {
	constructor(guildProfileRepository) {
		this.guildProfileRepository = guildProfileRepository;
	}

	async getGuildProfile(guild_id) {
		return await this.guildProfileRepository.getGuildProfile(guild_id);
	}

	async upsertGuildProfile(guildProfile) {
		guildProfile = guildProfile || new GuildProfile();
		guildProfile.mode = guildProfile.mode ?? Mode.ASK;
		guildProfile.platforms = guildProfile.platforms || {};

		platforms.forEach((platform) => {
			if (!(platform.name in guildProfile.platforms)) {
				guildProfile.platforms[platform.name] = true;
			}
		});

		return await this.guildProfileRepository.setGuildProfile(guildProfile);
	}

	async setPlatform(guildId, platform, isEnabled) {
		let guildProfile = await this.getGuildProfile(guildId);
		if (guildProfile) {
			guildProfile.platforms = guildProfile.platforms || {};
			guildProfile.platforms[platform] = isEnabled;
		}
		else {
			guildProfile = new GuildProfile(guildId, Mode.ASK, { [platform]: isEnabled });
		}

		await this.upsertGuildProfile(guildProfile);
	}

	async getPlatformListEmbed(guildId) {
		const guildProfile = await this.getGuildProfile(guildId);
		if (!guildProfile) {
			throw new Error('No platforms have been set.');
		}

		const enabledPlatforms = Object.keys(guildProfile.platforms).filter((platform) => guildProfile.platforms[platform]).join('\n');
		const disabledPlatforms = Object.keys(guildProfile.platforms).filter((platform) => !guildProfile.platforms[platform]).join('\n');

		const embed = new EmbedBuilder()
			.setTitle('Platforms')
			.addFields(
				{
					name: 'Enabled :white_check_mark:',
					value: enabledPlatforms.length > 0 ? enabledPlatforms : 'None',
				},
				{
					name: 'Disabled :x:',
					value: disabledPlatforms.length > 0 ? disabledPlatforms : 'None',
				},
			)
			.setColor([48, 209, 88])
			.setTimestamp();

		return embed;
	}
}

module.exports = GuildProfileService;
