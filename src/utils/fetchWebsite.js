const ogs = require('open-graph-scraper');

async function fetchWebsiteDetails(url) {
	try {
		const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36';
		const data = await ogs({ url, fetchOptions: { headers: { 'user-agent': userAgent } } });
		const { error, result } = data;
		if (error) {
			throw error;
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
