const { Events } = require('discord.js');
const EmbedMode = require('../models/embedMode.js');
const { setGuildMode } = require('../utils/db.js');


module.exports = {
	name: Events.GuildCreate,
	execute(guild) {
		setGuildMode(guild.id, EmbedMode.REPLY);
	},
};