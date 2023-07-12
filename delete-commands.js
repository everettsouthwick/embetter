const { REST, Routes } = require('discord.js');
const { clientId, commandId, guildId, token } = require('./config.json');

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started deleting ${commandId} application (/) command.`);
		const route = process.argv[2] === 'develop' ?
			Routes.applicationGuildCommand(clientId, guildId, commandId) :
			Routes.applicationCommand(clientId, commandId);
		await rest.delete(route);
		console.log(`Successfully deleted ${commandId} application (/) command.`);
	}
	catch (error) {
		console.error(error);
	}
})();
