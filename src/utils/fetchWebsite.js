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

		const links = await post.$$eval('a[role="link"]', (a) => a.map((link) => ({ href: link.href, text: link.innerText })));
		const images = await post.$$eval('img', (imgs) => imgs.map((img) => img.src));

		const ogUrl = links[0].href;
		const ogTitle = `@${links[1].text}`;
		const ogDescription = await post.$eval('p span', (span) => span.innerText);
		const thumbnail = images[0];
		const ogImage = images.slice(1).map(img => ({ url: img })) ?? null;
		const ogDate = await post.$eval('time', (time) => time.dateTime);
		const replies = links[links.length - 1].text;
		const likes = await post.$eval('div[role="button"] span', (span) => span.innerText);

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

module.exports = {
	fetchWebsiteDetails,
};