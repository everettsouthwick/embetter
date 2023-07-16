const ogs = require('open-graph-scraper');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const puppeteer = require('puppeteer');


async function fetchWebsiteDetails(url) {
	try {
		const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
		let options;
		if (url.includes('threads.net')) {
			try {
				return await parseThreadsData(url);
			}
			catch {
				// Do nothing
			}
			const html = await fetchRawHtml(url);
			options = { html };
		}
		else {
			options = { url, headers: { 'user-agent': userAgent } };
		}
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

async function fetchRawHtml(url) {
	const response = await fetch(url);
	return await response.text();
}

async function parseThreadsData(url) {
	let browser;

	try {
		browser = await puppeteer.launch({
			headless: 'new',
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const page = await browser.newPage();

		await page.goto(url, { waitUntil: 'domcontentloaded' });
		await page.waitForSelector('div.x11ql9d');

		const post = await page.$('div.x11ql9d');

		const links = await post.$$eval('a[role="link"]', (a) => a.map((link) => ({ href: link.href, text: link.innerText }))) ?? null;
		const videos = await post.$$eval('video', (vids) => vids.map((vid) => vid.src)) ?? null;
		const images = await post.$$eval('img', (imgs) => imgs.map((img) => img.src)) ?? null;

		const ogUrl = links[0]?.href ?? null;
		const ogTitle = `@${links[1]?.text}` ?? null;
		const ogDescription = await post.$eval('p span', (span) => span.innerText) ?? null;
		const thumbnail = images[0] ?? null;
		const ogImage = images?.slice(1).map(img => ({ url: img })) ?? null;
		const ogDate = await post.$eval('time', (time) => time.dateTime) ?? null;
		const replies = links[links?.length - 1].text ?? null;
		const likes = await post.$eval('div[role="button"] span', (span) => span.innerText) ?? null;
		const video = videos?.map((vid) => ({ url: vid })) ?? null;

		let repliesCount = 0;
		let likesCount = 0;
		if (replies && replies.includes('replies')) {
			repliesCount = parseInt(replies.split(' ')[0].replace(',', '')) || 0;
		}
		if (likes && likes.includes('likes')) {
			likesCount = parseInt(likes.split(' ')[0].replace(',', '')) || 0;
		}

		const engagementStats = `:speech_balloon: ${repliesCount.toLocaleString()} :heart: ${likesCount.toLocaleString()}`;

		return {
			ogSiteName: 'Threads',
			ogUrl,
			favicon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/_8T3PbCSTRI.png',
			ogTitle,
			ogDescription: `${ogDescription}\n\n${engagementStats}`,
			ogImage,
			thumbnail,
			ogDate,
			video,
		};
	}
	catch (error) {
		console.log(error);
		throw error;
	}
	finally {
		if (browser) {
			await browser.close();
		}
	}
}

async function downloadVideoToBuffer(url) {
	const headers = {
		'authority': 'scontent.cdninstagram.com',
		'accept': '*/*',
		'accept-encoding': 'identity;q=1, *;q=0',
		'accept-language': 'en-US,en;q=0.9',
		'Sec-Ch-Ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
		'Sec-Ch-Ua-Mobile': '?0',
		'Sec-Ch-Ua-Platform': '"Windows"',
		'Sec-Fetch-Dest': 'video',
		'Sec-Fetch-Site': 'cross-site',
		'cache-control': 'max-age=0',
		'sec-fetch-mode': 'navigate',
		'upgrade-insecure-requests': '1',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
		'viewport-width': '1280',
	};
	try {
		const response = await fetch(url, { headers: headers });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const buffer = await response.buffer();

		// Extract the id from the URL
		const id = url.split('/')[5].split('?')[0];

		return { id, buffer };
	}
	catch (error) {
		console.error(error);
		throw error;
	}
}

module.exports = {
	fetchWebsiteDetails,
	downloadVideoToBuffer,
};