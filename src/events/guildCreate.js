const { Events } = require('discord.js');
const { Mode } = require('../models/Mode.js');
const { GuildProfile } = require('../models/GuildProfile.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild) {
		const guildProfileService = guild.client.guildProfileService;

		const guildProfile = await guildProfileService.getGuildProfile(guild.id);
		if (guildProfile) return;
		await guildProfileService.upsertGuildProfile(new GuildProfile(guild.id, Mode.ASK, {}));
	},
};
