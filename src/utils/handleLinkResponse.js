const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, AttachmentBuilder } = require('discord.js');
const { processArchive, processLink } = require('./handleLink.js');
const { Mode } = require('../models/Mode.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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

	let file;
	let response;
	const url = 'https://scontent.cdninstagram.com/v/t50.2886-16/359675571_656411129694686_8205107505757813794_n.mp4?_nc_ht=scontent.cdninstagram.com&_nc_cat=102&_nc_ohc=MK_B9btXhGAAX9ykA88&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfDZqwGonBUDGZwYKQ6JGXjFXBSLC7tLgUSy4n22cDxKTA&oe=64B0EAC5&_nc_sid=10d13b';
	try {
		console.log('test');
		response = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
			},
		});
		console.log('test');
		const buffer = await response.buffer();
		console.log('test');
		file = new AttachmentBuilder(buffer, { name: 'video.mp4' });
	}
	catch (error) {
		console.error(error);
	}

	// embeds[0] = embeds[0].setImage('attachment://video.mp4');

	console.log(embeds[0]);

	if (embeds.length > 0) {
		response = await messageOrInteraction.reply({ embeds: embeds, components: [row], files: [file] });
	}
	else {
		response = await messageOrInteraction.reply({ content: links.join('\n') });
	}


	if (!isInteraction) {
		try {
			await checkForEmbed(response);
			await response.edit({ components: [row] });
		}
		catch {
			await response.delete();
		}
	}

	const collector = await response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

	collector.on('collect', async (i) => {
		if (i.customId === 'keep') {
			if (!isInteraction) {
				await messageOrInteraction.suppressEmbeds(true);
			}

			await collector.stop();
			await response.edit({ components: [] });
		}
		else if (i.customId === 'delete') {
			const userId = isInteraction ? messageOrInteraction.user.id : messageOrInteraction.author.id;
			if (i.user.id === userId) {
				await collector.stop();
				await response.delete();
			}
			else {
				await i.reply({ content: 'Only the original author can choose to delete this message.', ephemeral: true });
			}
		}
	});

	collector.on('end', async () => {
		try {
			await response.edit({ components: [] });
		}
		catch {
			// Do nothing
		}
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

	collector.on('collect', async (i) => {
		if (i.customId === 'yes') {
			await response.delete();
			await sendReplyModeMessage(message, links, embeds);
		}
		else if (i.customId === 'no') {
			if (i.user.id === message.author.id) {
				await response.delete();
			}
			else {
				await i.reply({ content: 'Only the original author can choose not to embed.', ephemeral: true });
			}
		}
	});

	collector.on('end', async () => {
		try {
			await response.delete();
		}
		catch {
			// Do nothing
		}
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
	const guildProfileService = message.client.guildProfileService;
	const guildProfile = await guildProfileService.getGuildProfile(message.guild.id);

	const { fullMessage, links, embeds } = await processLink(message.content, guildProfile);
	if (links.length > 0 || embeds.length > 0) {
		if (guildProfile?.mode == Mode.REPLACE) {
			await sendReplaceModeMessage(message, fullMessage, embeds);
		}
		else if (guildProfile?.mode == Mode.REPLY) {
			await sendReplyModeMessage(message, links, embeds);
		}
		else if (guildProfile?.mode == Mode.ASK) {
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
