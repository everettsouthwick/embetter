const ogs = require('open-graph-scraper');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function fetchWebsiteDetails(url) {
	try {
		const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
		let options;
		if (url.includes('threads.net')) {
			const html = await fetchHtml(url);
			options = { html: html };
		}
		else {
			options = { url, headers: { 'user-agent': userAgent } };
		}
		const data = await ogs(options);

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

async function fetchHtml(url) {
	const response = await fetch(url);
	return await response.text();
}

module.exports = {
	fetchWebsiteDetails,
};