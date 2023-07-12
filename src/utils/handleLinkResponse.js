const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { processArchive, processLink } = require('./handleLink.js');
const { getGuildMode } = require('./db.js');
const { Mode } = require('../models/mode.js');

async function sendReplaceModeMessage(message, fullMessage, embeds) {
	await message.delete();
	if (embeds.length > 0) {
		await message.channel.send({ content: `${message.author}: ${fullMessage}`, embeds: embeds });
	}
	else {
		await message.channel.send({ content: `${message.author}: ${fullMessage}` });
	}

}

async function sendReplyModeMessage(messageOrInteraction, links, embeds) {
	const isInteraction = messageOrInteraction.commandId ? true : false;

	const confirm = new ButtonBuilder()
		.setCustomId('keep')
		.setLabel('Keep')
		.setStyle(ButtonStyle.Primary);

	const cancel = new ButtonBuilder()
		.setCustomId('delete')
		.setLabel('Delete')
		.setStyle(ButtonStyle.Danger);

	const row = new ActionRowBuilder()
		.addComponents(confirm, cancel);

	let response;
	if (embeds.length > 0) {
		response = await messageOrInteraction.reply({ embeds: embeds, components: [row] });
	}
	else {
		response = await messageOrInteraction.reply({ content: links.join('\n') });
	}

	try {
		await checkForEmbed(response);
		await response.edit({ components: [row] });
	}
	catch {
		await response.delete();
	}

	const collector = await response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

	collector.on('collect', async i => {
		if (i.customId === 'keep') {
			await messageOrInteraction.suppressEmbeds(true);
			await collector.stop();
			await response.edit({ components: [] });
		}
		else if (i.customId === 'delete') {
			const userId = isInteraction ? messageOrInteraction.user.id : messageOrInteraction.author.id;
			if (i.user.id === userId) {
				await collector.stop();
				await response.delete();
			} else {
				await i.reply({ content: 'Only the original author can choose to delete this message.', ephemeral: true });
			}
		}
	});

	collector.on('end', async () => {
		await response.edit({ components: [] });
	});
}

async function sendAskModeMessage(message, links, embeds) {
	const confirm = new ButtonBuilder()
		.setCustomId('yes')
		.setLabel('Yes')
		.setStyle(ButtonStyle.Primary);

	const cancel = new ButtonBuilder()
		.setCustomId('no')
		.setLabel('No')
		.setStyle(ButtonStyle.Secondary);

	const row = new ActionRowBuilder()
		.addComponents(confirm, cancel);

	const response = await message.reply({ content: 'Would you like to embed this link?', components: [row] });

	const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

	collector.on('collect', async i => {
		if (i.customId === 'yes') {
			await response.delete();
			await sendReplyModeMessage(message, links, embeds);
		}
		else if (i.customId === 'no') {
			if (i.user.id === message.author.id) {
				await response.delete();
			} else {
				await i.reply({ content: 'Only the original author can choose not to embed.', ephemeral: true });
			}
		}
	});

	collector.on('end', async () => {
		await response.delete();
	});
}

async function checkForEmbed(message) {
	const startTime = Date.now();

	return new Promise((resolve, reject) => {
		const embedCheck = setInterval(() => {
			if (message.embeds.length > 0) {
				clearInterval(embedCheck);
				resolve(true);
			}
			else if (Date.now() - startTime > 5000) {
				clearInterval(embedCheck);
				reject(false);
			}
		}, 200);
	});
}


async function handleContextMenuLink(interaction) {
	const { links, embeds } = await processLink(interaction.targetMessage.content);
	if (links.length > 0 || embeds.length > 0) {
		await sendReplyModeMessage(interaction, links, embeds);
	}
	else {
		interaction.reply({ content: 'No valid link was found.', ephemeral: true });
	}
}

async function handleContextMenuArchive(interaction) {
	const { links, embeds } = await processArchive(interaction.targetMessage.content);
	if (embeds.length > 0) {
		await sendReplyModeMessage(interaction, links, embeds);
	}
	else {
		interaction.reply({ content: 'No valid link was found.', ephemeral: true });
	}
}

async function handleSlashCommandLink(interaction) {
	const { links, embeds } = await processLink(interaction.options.getString('link'));
	if (links.length > 0 || embeds.length > 0) {
		await sendReplyModeMessage(interaction, links, embeds);
	}
	else {
		interaction.reply({ content: 'No valid link was found.', ephemeral: true });
	}
}

async function handleSlashCommandArchive(interaction) {
	const { links, embeds } = await processArchive(interaction.options.getString('link'));
	if (embeds.length > 0) {
		await sendReplyModeMessage(interaction, links, embeds);
	}
	else {
		interaction.reply({ content: 'No valid link was found.', ephemeral: true });
	}
}

async function handleMessageLink(message) {
	const { fullMessage, links, embeds } = await processLink(message.content);
	if (links.length > 0 || embeds.length > 0) {
		const mode = await getGuildMode(message.guild.id);
		if (mode == Mode.REPLACE) {
			await sendReplaceModeMessage(message, fullMessage, embeds);
		}
		else if (mode == Mode.REPLY) {
			await sendReplyModeMessage(message, links, embeds);
		}
		else if (mode == Mode.ASK) {
			await sendAskModeMessage(message, links, embeds);
		}
	}
}

module.exports = {
	handleContextMenuLink,
	handleContextMenuArchive,
	handleSlashCommandLink,
	handleSlashCommandArchive,
	handleMessageLink,
};