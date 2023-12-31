const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('discord.js');

const contextCommands = [];
const slashCommands = [];
const commandsDir = path.join(__dirname, 'src/commands');

function loadCommands(dir) {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);

		if (fs.lstatSync(fullPath).isDirectory()) {
			loadCommands(fullPath);
		}
		else if (file.endsWith('.js')) {
			const command = require(fullPath);
			if ('data' in command && 'execute' in command) {
				if (command.data instanceof SlashCommandBuilder) {
					slashCommands.push(command.data.toJSON());
				}
				else if (command.data instanceof ContextMenuCommandBuilder) {
					contextCommands.push(command.data.toJSON());
				}
			}
			else {
				console.log(`[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

loadCommands(commandsDir);

const rest = new REST().setToken(token);

const allCommands = [...slashCommands, ...contextCommands];

(async () => {
	try {
		console.log(`Started refreshing ${slashCommands.length} application (/) commands and ${contextCommands.length} context commands.`);
		const route = process.argv[2] === 'develop' ?
			Routes.applicationGuildCommands(clientId, guildId) :
			Routes.applicationCommands(clientId);
		const responseData = await rest.put(route, { body: allCommands });
		console.log(`Successfully reloaded ${responseData.length} application (/) commands and context commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();

