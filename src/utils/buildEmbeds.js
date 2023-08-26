const { EmbedBuilder } = require('discord.js');
const { fetchWebsiteDetails } = require('./fetchWebsite.js');

async function buildEmbeds(platform, originalUrl, newUrl) {
	try {
		const data = await fetchWebsiteDetails(originalUrl);

		if (!data) {
			return [];
		}

		const embeds = [];
		const addedImageUrls = new Set();
		const base = new URL(data.ogUrl || data.twitterUrl || data.requestUrl || originalUrl);

		if (data.favicon?.includes('.svg')) {
			data.favicon = null;
		}

		if (data.favicon?.startsWith('/')) {
			data.favicon = base.origin + data.favicon;
		}

		if (data.ogImage?.length > 0 && data.ogImage[0]?.url?.startsWith('/')) {
			data.ogImage[0].url = base.origin + data.ogImage[0].url;
		}

		if (data.twitterImage?.length > 0 && data.twitterImage[0]?.url?.startsWith('/')) {
			data.twitterImage[0].url = base.origin + data.twitterImage[0].url;
		}

		if (data.ogImage?.length > 1 || data.twitterImage?.length > 1) {
			data.thumbnail = null;
		}

		const embed = new EmbedBuilder()
			.setAuthor({
				name: data.ogSiteName || data.alAndroidAppName || data.alIphoneAppName || data.twitterAppNameGooglePlay || base.host || platform.embed?.name || null,
				url: data.ogUrl || data.twitterUrl || data.requestUrl || originalUrl || null,
				iconURL: data.favicon || platform.embed?.author?.iconURL || null,
			})
			.setTitle(data.ogTitle || data.twitterTitle || platform.embed?.name || null)
			.setURL(newUrl || null)
			.setDescription(data.ogDescription || data.twitterDescription || null)
			.setImage(data.ogImage?.length > 0 ? data.ogImage[0]?.url : null || data.twitterImage?.length > 0 ? data.twitterImage[0]?.url : null || null)
			.setThumbnail(data.thumbnail || null)
			.setColor(platform.embed?.color || [48, 209, 88])
			.setTimestamp(new Date(data.ogDate || data.articleModifiedTime || data.articlePublishedTime || Date.now()) || null);

		if (embed.image && embed.image.url) {
			addedImageUrls.add(embed.image.url);
		}

		embeds.push(embed);

		const imagesArray = data.ogImage || data.twitterImage || null;

		if (imagesArray?.length > 1) {
			for (let i = 1; i < imagesArray.length; i++) {
				const image = imagesArray[i];

				if (image.url && !addedImageUrls.has(image.url)) {
					addedImageUrls.add(image.url);

					embeds.push(new EmbedBuilder()
						.setURL(newUrl || null)
						.setImage(image.url || null),
					);
				}
			}
		}

		return embeds;
	}
	catch (error) {
		console.error('Error building embed:', error);
		throw error;
	}
}

module.exports = {
	buildEmbeds,
};