const { Events } = require('discord.js');
const axios = require('axios');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log(`Active in ${client.guilds.cache.size} servers`);
	},
};
