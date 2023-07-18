const ogs = require('open-graph-scraper');


async function fetchWebsiteDetails(url) {
	try {
		const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
		const options = { url, headers: { 'user-agent': userAgent } };
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