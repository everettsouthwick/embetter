const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
});

client.commands = new Collection();

// General function to load items (commands or events)
function loadItems(dir, type) {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);

		if (fs.lstatSync(fullPath).isDirectory()) {
			loadItems(fullPath, type);
		}
		else if (file.endsWith('.js')) {
			const item = require(fullPath);
			if (type === 'commands' && 'data' in item && 'execute' in item) {
				client.commands.set(item.data.name, item);
			}
			else if (type === 'events') {
				if (item.once) {
					client.once(item.name, (...args) => item.execute(...args));
				}
				else {
					client.on(item.name, (...args) => item.execute(...args));
				}
			}
			else {
				console.log(`[WARNING] The ${type} at ${fullPath} is missing required properties.`);
			}
		}
	}
}

// Start recursion from root directories
loadItems(path.join(__dirname, 'src/commands'), 'commands');
loadItems(path.join(__dirname, 'src/events'), 'events');

// Instantiate services
const getRepositories = require('./src/utils/getRepositories');
const GuildProfileService = require('./src/services/GuildProfileService');
let guildProfileService;

getRepositories()
	.then((repositories) => {
		guildProfileService = new GuildProfileService(repositories.guildProfileRepository);
		client.guildProfileService = guildProfileService;
	})
	.catch(console.error);

client.login(token);
