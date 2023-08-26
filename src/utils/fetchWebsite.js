const ogs = require('open-graph-scraper');
const randomUseragent = require('random-useragent');


async function fetchWebsiteDetails(url) {
	try {
		const options = { url, headers: { 'user-agent': randomUseragent.getRandom() } };
		const data = await ogs(options);

		const { error, result } = data;
		if (error) {
			throw error;
		}
		if (!result.success) {
			throw new Error('No Open Graph data found');
		}

		return result;
	}
	catch (error) {
		console.error('Error fetching website details:', error);
		throw error;
	}
}

module.exports = {
	fetchWebsiteDetails,
};