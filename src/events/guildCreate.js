const { Events } = require('discord.js');
const { Mode } = require('../models/mode.js');
const { setGuildMode } = require('../utils/db.js');


module.exports = {
	name: Events.GuildCreate,
	execute(guild) {
		setGuildMode(guild.id, Mode.ASK);
	},
};