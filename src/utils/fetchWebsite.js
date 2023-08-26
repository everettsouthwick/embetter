const ogs = require('open-graph-scraper');


async function fetchWebsiteDetails(url) {
	try {
		const options = { url, headers:
			{
				'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'max-age=0',
				'if-modified-since': 'Sat, 26 Aug 2023 17:58:14 GMT',
				'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'none',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
			},
		};
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