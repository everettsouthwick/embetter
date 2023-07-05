const { EmbedBuilder } = require('discord.js');
const { fetchWebsiteDetails } = require('./fetchWebsite.js');

async function buildEmbed(platform, originalUrl, newUrl) {
	try {
		// Fetch the website details based on the original URL
		const data = await fetchWebsiteDetails(originalUrl);
        const base = new URL(data.ogUrl || data.twitterUrl || data.requestUrl || originalUrl);
        console.log(data);

        if (data.favicon?.includes('.ico')) {
            data.favicon = null;
        }

        if (data.favicon?.startsWith('/')) {
            data.favicon = base.origin + data.favicon;
        }
		

		const embed = new EmbedBuilder()
			.setAuthor({
				name: data.ogSiteName || base.host || platform.name || null,
				url: data.ogUrl || data.twitterUrl || data.requestUrl || originalUrl || null,
				iconURL: data.favicon || platform.author?.iconURL || null,
			})
			.setTitle(data.ogTitle || data.twitterTitle || platform.name || null)
			.setURL(newUrl || null)
			.setDescription(data.ogDescription || data.twitterDescription || null)
			.setImage(data.ogImage[0]?.url || data.twitterImage[0]?.url || null)
			.setTimestamp(new Date(data.ogDate || data.articleModifiedTime || data.articlePublishedTime || Date.now()) || null);
		return embed;
	}
	catch (error) {
		console.error('Error building embed:', error);
		throw error;
	}
}

module.exports = {
    buildEmbed
}