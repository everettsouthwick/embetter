const { Events } = require('discord.js');
const axios = require('axios');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log(`Active in ${client.guilds.cache.size} servers`);

		try {
			const res = await axios.get('https://api.ipify.org?format=json');
			console.log(`Public IP: ${res.data.ip}`);
		} catch (err) {
			console.error('Error getting public IP:', err);
		}
	},
};
