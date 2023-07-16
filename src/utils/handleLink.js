const platforms = require('../constants/platforms.js');
const { buildEmbeds } = require('./buildEmbeds.js');

function isValidUrl(string) {
	try {
		new URL(string);
		return true;
	}
	catch (_) {
		return false;
	}
}

function stripQueryString(url) {
	const urlObject = new URL(url);
	return urlObject.origin + urlObject.pathname;
}

function getPlatform(message, guildProfile) {
	for (const platform of platforms) {
		if (platform.pattern.test(message)) {
			if (guildProfile?.platforms?.[platform.name] !== false) {
				return platform;
			}
		}
	}
	return null;
}


function replaceLink(message, platform) {
	const originalUrl = message.match(platform.pattern)[0];
	let newMessage = message;
	let newUrl = originalUrl;

	if (platform.replacement) {
		newMessage = message.replace(platform.pattern, platform.replacement);
		newUrl = platform.replacement(originalUrl);
	}

	return { newMessage, originalUrl, newUrl };
}

async function handleEmbeds(platform, originalUrl, newUrl) {
	let embeds = [];
	let files = [];
	if (platform.embed) {
		try {
			const embedResult = await buildEmbeds(platform, originalUrl, newUrl);
			embeds = embedResult.embeds;
			files = embedResult.files;
		}
		catch (error) {
			console.error('Error building embed for', platform.name, ':', error);
		}
	}
	return { embeds, files };
}

async function processLink(message, guildProfile) {
	let newMessage = message;
	const links = [];
	let embeds = [];
	let files = [];
	let embedResult = {};

	const platform = getPlatform(message, guildProfile);
	if (platform) {
		const replacementResult = replaceLink(message, platform);
		newMessage = replacementResult.newMessage;
		embedResult = await handleEmbeds(platform, replacementResult.originalUrl, replacementResult.newUrl);
		embeds = embedResult.embeds;
		files = embedResult.files;
		links.push(replacementResult.newUrl);
	}

	return { fullMessage: newMessage, links: links, embeds: embeds, files: files };
}

async function processArchive(link) {
	const links = [];
	let embeds = [];
	let files = [];

	if (!isValidUrl(link)) {
		return { links: links, embeds: [] };
	}

	const strippedLink = stripQueryString(link);
	const platform = {
		name: 'Archive',
		pattern: new RegExp(`(${strippedLink})`, 'g'),
		replacement: (url) => `https://archive.today/newest/${url}`,
	};

	const newUrl = platform.replacement(strippedLink);

	try {
		const embedResult = await buildEmbeds(platform, strippedLink, newUrl);
		embeds = embedResult.embeds;
		files = embedResult.files;
	}
	catch (error) {
		console.error('Error building embed for', platform.name, ':', error);
	}

	return { links: links, embeds: embeds, files: files };
}

module.exports = {
	processLink,
	processArchive,
};