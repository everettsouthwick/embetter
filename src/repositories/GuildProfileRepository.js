const { GuildProfile } = require('../models/GuildProfile.js');

class GuildProfileRepository {
	constructor(db) {
		this.collection = db.collection('guilds');
	}

	async setGuildProfile(guildProfile) {
		return this.collection.updateOne({ _id: guildProfile.id }, { $set: guildProfile }, { upsert: true });
	}

	async getGuildProfile(guild_id) {
		const guildData = await this.collection.findOne({ _id: guild_id });
		if (!guildData) return null;
		return new GuildProfile(guildData._id, guildData.mode, guildData.platforms);
	}
}

module.exports = GuildProfileRepository;
