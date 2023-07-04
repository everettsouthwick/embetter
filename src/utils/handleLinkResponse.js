const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const replaceLink = require('./handleLink.js');
const { getGuildMode } = require('./db.js');
const EmbedMode = require('./embedMode.js');

async function sendReplaceModeMessage(message, fullMessage, embeds) {
	await message.delete();
	if (embeds.length > 0) {
		await message.channel.send({ content:`${message.author}: ${fullMessage}`, embeds: embeds });
	}
	else {
		await message.channel.send({ content:`${message.author}: ${fullMessage}` });
	}

}

async function sendReplyModeMessage(messageOrInteraction, links, embeds) {
	const isInteraction = messageOrInteraction.commandId ? true : false;

	const confirm = new ButtonBuilder()
		.setCustomId('confirm')
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
		response = await messageOrInteraction.reply({ content: links.join('\n'), components: [row] });
	}

	const collectorFilter = i => i.user.id === (isInteraction ? messageOrInteraction.user.id : messageOrInteraction.author.id);

	try {
		const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

		await confirmation.update({ components: [] });

		if (confirmation.customId === 'delete') {
			await response.delete();
		}
	}
	catch (e) {
		await response.edit({ components: [] });
	}
}

async function sendManualModeMessage(message, links, embeds) {
	const confirm = new ButtonBuilder()
		.setCustomId('confirm')
		.setLabel('Yes')
		.setStyle(ButtonStyle.Primary);

	const cancel = new ButtonBuilder()
		.setCustomId('cancel')
		.setLabel('No')
		.setStyle(ButtonStyle.Secondary);

	const row = new ActionRowBuilder()
		.addComponents(confirm, cancel);

	const response = await message.reply({ content: 'Would you like to embed this link?', components: [row] });

	const collectorFilter = i => i.user.id === message.author.id;

	try {
		const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
		if (confirmation.customId === 'confirm') {
			await confirmation.update({ components: [] });
			await response.delete();
			await sendReplyModeMessage(message, links, embeds);
		}
		else if (confirmation.customId === 'cancel') {
			await confirmation.update({ components: [] });
			await response.delete();
		}
	}
	catch (e) {
		await response.edit({ components: [] });
		await response.delete();
	}
}

async function handleContextMenuLink(interaction) {
	const { links, embeds } = await replaceLink(interaction.targetMessage.content);
	if (links.length > 0 || embeds.length > 0) {
		sendReplyModeMessage(interaction, links, embeds);
	}
	else {
		interaction.reply({ content: 'No valid link was found.', ephemeral: true });
	}
}

async function handleSlashCommandLink(interaction) {
	const { links, embeds } = await replaceLink(interaction.options.getString('link'));
	if (links.length > 0 || embeds.length > 0) {
		sendReplyModeMessage(interaction, links, embeds);
	}
	else {
		interaction.reply({ content: 'No valid link was found.', ephemeral: true });
	}
}

async function handleMessageLink(message) {
	const { fullMessage, links, embeds } = await replaceLink(message.content);
	if (links.length > 0 || embeds.length > 0) {
		const mode = await getGuildMode(message.guild.id);
		if (mode == EmbedMode.REPLACE) {
			await sendReplaceModeMessage(message, fullMessage, embeds);
		}
		else if (mode == EmbedMode.REPLY) {
			await sendReplyModeMessage(message, links, embeds);
		}
		else {
			await sendManualModeMessage(message, links, embeds);
		}
	}
}

module.exports = {
	handleContextMenuLink,
	handleSlashCommandLink,
	handleMessageLink,
};