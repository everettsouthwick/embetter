const platforms = require('../constants/platforms.js');
const { buildEmbeds } = require('./buildEmbeds.js');

const isValidUrl = string => {
	try {
		new URL(string);
		return true;
	}
	catch (_) {
		return false;
	}
};

const stripQueryString = url => new URL(url).origin + new URL(url).pathname;

const getPlatform = (message, guildProfile) => {
	for (const platform of platforms) {
		if (!platform.pattern.test(message)) continue;
		if (guildProfile?.platforms?.[platform.name] === false) continue;
		return platform;
	}
	return null;
};

const replaceLink = (message, platform) => {
	const originalUrl = message.match(platform.pattern)[0].split(' ')[0];
	const newUrl = platform.replacement ? platform.replacement(originalUrl) : originalUrl;
	return { newMessage: message.replace(platform.pattern, newUrl || originalUrl), originalUrl, newUrl };
};

const handleEmbeds = async (platform, originalUrl, newUrl) => {
	try { return platform.embed ? await buildEmbeds(platform, originalUrl, newUrl) : []; }
	catch (error) { console.error('Error building embed for', platform.name, ':', error); return []; }
};

const processLink = async (message, guildProfile) => {
	const platform = getPlatform(message, guildProfile);
	if (!platform) return { fullMessage: message, links: [], embeds: [] };

	const { newMessage, originalUrl, newUrl } = replaceLink(message, platform);
	const embeds = await handleEmbeds(platform, originalUrl, newUrl);
	return { fullMessage: newMessage, links: [newUrl], embeds };
};

const processArchive = async link => {
	if (!isValidUrl(link)) return { links: [], embeds: [] };

	const strippedLink = stripQueryString(link);
	const newUrl = `https://archive.today/newest/${strippedLink}`;
	try { return { links: [newUrl], embeds: await buildEmbeds({ name: 'Archive' }, strippedLink, newUrl) }; }
	catch (error) { console.error('Error building embed for Archive:', error); return { links: [newUrl], embeds: [] }; }
};

module.exports = { processLink, processArchive };
