const GuildProfileRepository = require('../repositories/GuildProfileRepository');
const connect = require('../db/db');

let db;

async function getRepositories() {
	if (!db) {
		db = await connect();
	}

	return {
		guildProfileRepository: new GuildProfileRepository(db),
	};
}

module.exports = getRepositories;
