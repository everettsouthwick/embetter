const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionsBitField } = require('discord.js');
const { processArchive, processLink } = require('./handleLink.js');
const { Mode } = require('../models/Mode.js');

async function sendReplaceModeMessage(message, fullMessage, embeds) {
	await message.delete();
	const content = { content: `${message.author}: ${fullMessage}`, embeds: embeds.length ? embeds : undefined };
	await message.channel.send(content);
}

async function sendReplyModeMessage(messageOrInteraction, links, embeds) {
	const isInteraction = Boolean(messageOrInteraction.commandId);
	const userId = isInteraction ? messageOrInteraction.user.id : messageOrInteraction.author.id;
	const components = [new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId('keep').setLabel('Keep').setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId('delete').setLabel('Delete').setStyle(ButtonStyle.Danger),
	)];
	const options = { content: links.join('\n'), embeds: embeds.length ? embeds : undefined, components };
	const response = await messageOrInteraction.reply(options);

	if (!isInteraction && !(await checkForEmbed(response, embeds))) return await response.delete();
	if (!isInteraction) await response.edit({ components });

	const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 180000 });
	collector.on('collect', async (i) => {
		if (i.customId === 'keep') return collector.stop() && await response.edit({ components: [] });
		if (i.user.id !== userId && !i.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await i.reply({ content: 'You are not authorized to delete this message.', ephemeral: true });
		await response.delete() && await collector.stop();
	});
	collector.on('end', async () => await response.edit({ components: [] }).catch(() => {}));
}

async function sendAskModeMessage(message, links, embeds) {
	const components = [new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId('yes').setLabel('Yes').setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId('no').setLabel('No').setStyle(ButtonStyle.Secondary),
	)];
	const response = await message.reply({ content: 'Would you like to embed this link?', components });

	const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 180000 });
	collector.on('collect', async (i) => {
		if (i.customId === 'yes') return await response.delete() && await sendReplyModeMessage(message, links, embeds);
		if (i.user.id !== message.author.id && !i.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await i.reply({ content: 'You are not authorized to choose not to embed', ephemeral: true });
		await response.delete();
	});
	collector.on('end', async () => await response.delete().catch(() => {}));
}

async function checkForEmbed(message) {
	if (message.content.includes('archive.today')) return Promise.resolve(true);
	const startTime = Date.now();
	return new Promise((resolve) => {
		const check = setInterval(() => {
			if (message.embeds.length) return clearInterval(check) && resolve(true);
			if (Date.now() - startTime > 10000) return clearInterval(check) && resolve(false);
		}, 200);
	});
}

async function handleInteraction(interaction, processFn) {
	const { links, embeds } = await processFn(interaction.options.getString('link'));
	if (!links.length && !embeds.length) return interaction.reply({ content: 'No valid link was found.', ephemeral: true });
	await sendReplyModeMessage(interaction, links, embeds);
}

async function handleMessageLink(message) {
	const guildProfile = await message.client.guildProfileService.getGuildProfile(message.guild.id);
	const { fullMessage, links, embeds } = await processLink(message.content, guildProfile);

	if (!links.length && !embeds.length) return;
	if (guildProfile?.mode === Mode.REPLACE) return await sendReplaceModeMessage(message, fullMessage, embeds);
	if (guildProfile?.mode === Mode.REPLY) return await sendReplyModeMessage(message, links, embeds);
	if (guildProfile?.mode === Mode.ASK) return await sendAskModeMessage(message, links, embeds);
}

module.exports = {
	handleContextMenuLink: (interaction) => handleInteraction(interaction, processLink),
	handleContextMenuArchive: (interaction) => handleInteraction(interaction, processArchive),
	handleSlashCommandLink: (interaction) => handleInteraction(interaction, processLink),
	handleSlashCommandArchive: (interaction) => handleInteraction(interaction, processArchive),
	handleMessageLink,
};
