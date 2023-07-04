const { EmbedBuilder } = require('discord.js');
const { fetchWebsiteDetails } = require('./fetchWebsite.js');

async function buildEmbed(platform, originalUrl, newUrl) {
	try {
		// Fetch the website details based on the original URL
		const data = await fetchWebsiteDetails(originalUrl);

		let iconURL = platform.embed?.author.iconURL;
		if (!data.favicon.includes('.svg')) {
			iconURL = data.favicon;
			if (data.favicon.startsWith('/')) {
				const base = new URL(data.requestUrl);

				iconURL = base.origin + data.favicon;
			}
		}

		const embed = new EmbedBuilder()
			.setAuthor({
				name: data.ogSiteName || platform.name,
				url: data.requestUrl,
				iconURL: iconURL,
			})
			.setTitle(data.ogTitle)
			.setURL(newUrl)
			.setDescription(data.ogDescription)
			.setImage(data.ogImage[0].url)
			.setTimestamp(new Date(data.ogDate || data.articleModifiedTime));
		return embed;
	}
	catch (error) {
		console.error('Error building embed:', error);
		throw error;
	}
}

module.exports = async function replaceLink(message) {
	const platforms = [
		{
			name: 'Instagram',
			pattern: /(http[s]?:\/\/(?:www\.)?instagram\.[a-zA-Z0-9-]+\/(?:p|stories|live|reel)(.*))/g,
			replacement: (url) => url.split('?')[0].replace('instagram.', 'ddinstagram.'),
		},
		{
			name: 'TikTok',
			pattern: /(http[s]?:\/\/(?:www\.|vm\.)?tiktok\.[a-zA-Z0-9-]+\/([a-zA-Z0-9_\/]*))(?:\?.*)?/g,
			replacement: (url) => url.split('?')[0].replace('tiktok.', 'vxtiktok.'),
		},
		{
			name: 'Twitter',
			pattern: /(http[s]?:\/\/(?:www\.|m\.|mobile\.)?twitter\.[a-zA-Z0-9-]+\/(?:i\/status|([a-zA-Z0-9_]+)\/status)\/([0-9]+)(\?[a-zA-Z0-9_=&-]*)?)/g,
			replacement: (url) => url.split('?')[0].replace('twitter.', 'vxtwitter.'),
		},
		{
			name: 'YouTube',
			pattern: /(http[s]?:\/\/(?:www\.)?youtube\.[a-zA-Z0-9-]+\/shorts\/[a-zA-Z0-9_-]+(?:\?.*)?)/g,
			replacement: (url) => url.split('?')[0].replace('/shorts/', '/video/'),
		},
		{
			name: 'The New York Times',
			pattern: /(http[s]?:\/\/(?:www\.)?nytimes\.[a-zA-Z0-9-]+\/(.*))/g,
			replacement: (url) => `https://archive.today/newest/${url.split('?')[0]}`,
			embed: {
				author: {
					name: 'The New York Times',
					url: 'https://www.nytimes.com/',
					iconURL: 'https://www.nytimes.com/vi-assets/static-assets/ios-default-homescreen-57x57-dark-b395ebcad5b63aff9285aab58e31035e.png',
				},
			},
		},
		{
			name: 'Bloomberg',
			pattern: /(http[s]?:\/\/(?:www\.)?bloomberg\.[a-zA-Z0-9-]+\/(.*))/g,
			replacement: (url) => `https://archive.today/newest/${url.split('?')[0]}`,
			embed: {
				author: {
					name: 'Bloomberg',
					url: 'https://www.bloomberg.com/',
					iconURL: 'https://www.bloomberg.com/favicon-black.png',
				},
			},
		},
		{
			name: 'Rolling Stone',
			pattern: /(http[s]?:\/\/(?:www\.)?rollingstone\.[a-zA-Z0-9-]+\/(.*))/g,
			replacement: (url) => `https://archive.today/newest/${url.split('?')[0]}`,
			embed: {
				author: {
					name: 'Rolling Stone',
					url: 'https://www.rollingstone.com/',
					iconURL: 'https://www.rollingstone.com/wp-content/uploads/2022/08/cropped-Rolling-Stone-Favicon.png?w=180',
				},
			},
		},
		{
			name: 'The Atlantic',
			pattern: /(http[s]?:\/\/(?:www\.)?theatlantic\.[a-zA-Z0-9-]+\/(.*))/g,
			replacement: (url) => `https://archive.today/newest/${url.split('?')[0]}`,
			embed: {
				author: {
					name: 'The Atlantic',
					url: 'https://www.theatlantic.com/',
					iconURL: 'https://cdn.theatlantic.com/_next/static/images/apple-touch-icon-default-b504d70343a9438df64c32ce339c7ebc.png',
				},
			},
		},
		{
			name: 'The Wall Street Journal',
			pattern: /(http[s]?:\/\/(?:www\.)?wsj\.[a-zA-Z0-9-]+\/(.*))/g,
			replacement: (url) => `https://archive.today/newest/${url.split('?')[0]}`,
			embed: {
				author: {
					name: 'The Wall Street Journal',
					url: 'https://www.wsj.com/',
					iconURL: 'https://s.wsj.net/media/wsj_apple-touch-icon-180x180.png',
				},
			},
		},
		{
			name: 'The Washington Post',
			pattern: /(http[s]?:\/\/(?:www\.)?washingtonpost\.[a-zA-Z0-9-]+\/(.*))/g,
			replacement: (url) => `https://archive.today/newest/${url.split('?')[0]}`,
			embed: {
				author: {
					name: 'The Washington Post',
					url: 'https://www.washingtonpost.com/',
					iconURL: 'https://www.washingtonpost.com/touch-icon-iphone.png',
				},
			},
		},
	];

	let newMessage = message;
	const links = [];
	const embeds = [];

	// Iterate over each platform
	for (const platform of platforms) {
		if (platform.pattern.test(message)) {
			const originalUrl = message.match(platform.pattern)[0];
			newMessage = newMessage.replace(platform.pattern, platform.replacement);
			const newUrl = platform.replacement(originalUrl);

			if (platform.embed) {
				try {
					const embed = await buildEmbed(platform, originalUrl, newUrl);
					embeds.push(embed);
				}
				catch (error) {
					console.error('Error building embed for', platform.name, ':', error);
				}
			}
			else {
				links.push(newUrl);
			}
		}
	}

	return { fullMessage: newMessage, links: links, embeds: embeds };
};