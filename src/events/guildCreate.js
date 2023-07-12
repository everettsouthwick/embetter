const { Events } = require('discord.js');
const { Mode } = require('../models/mode.js');
const { getRepositories } = require('../utils/db.js');
const { GuildProfile } = require('../models/guildProfile.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild) {
		const repositories = getRepositories();
		const guildRepository = repositories.guildRepository;

		const guildProfile = await guildRepository.getGuildProfile(guild.id);
		if (guildProfile) return;
		await guildRepository.setGuildProfile(new GuildProfile(guild.id, Mode.ASK, {}));
	},
};