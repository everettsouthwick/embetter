const { MongoClient, ServerApiVersion } = require('mongodb');
const { mongoDbUri } = require('../../config.json');
const { GuildProfile } = require('../models/guildProfile.js');

const client = new MongoClient(mongoDbUri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

let db;

class GuildRepository {
	constructor(db) {
		this.collection = db.collection('guilds');
	}

	async setGuildProfile(guild) {
		return this.collection.updateOne({ _id: guild.id }, { $set: guild }, { upsert: true });
	}

	async getGuildProfile(guild_id) {
		const guildData = await this.collection.findOne({ _id: guild_id });
		if (!guildData) return null;
		return new GuildProfile(guildData._id, guildData.mode, guildData.platforms);
	}
}

async function run() {
	try {
		await client.connect();
		db = client.db("embetter");
	} catch (err) {
		console.error(err);
	}
}

run().catch(console.dir);

module.exports = {
	getRepositories: () => ({
		guildRepository: new GuildRepository(db),
	}),
};
