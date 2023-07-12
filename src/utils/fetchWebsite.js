const ogs = require('open-graph-scraper');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const puppeteer = require('puppeteer');


async function fetchWebsiteDetails(url) {
	try {
		const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
		let options;
		if (url.includes('threads.net')) {
			try {
				return await parseHtml(url);
			}
			catch {
				// Do nothing
			}
			const html = await fetchHtml(url);
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

async function parseHtml(url) {
	let browser;

	try {
		const browser = await puppeteer.launch({
			headless: 'new',
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		const page = await browser.newPage();

		// Go to the specified URL
		await page.goto(url, { waitUntil: 'domcontentloaded' });

		await page.waitForSelector('img.xl1xv1r.x14yjl9h.xudhj91.x18nykt9.xww2gxu');

		async function getElementByXpath(page, xpath) {
			const elements = await page.$x(xpath);
			if (elements.length > 0) {
				return elements[0];
			} else {
				throw new Error(`No element found for XPath: ${xpath}`);
			}
		}

		const thread = await getElementByXpath(page, '/html/body/div[2]/div/div/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div/div');

		const links = await thread.$$eval('a[role="link"]', links => links.map(link => ({ href: link.href, text: link.innerText })));
		const images = await thread.$$eval('img', imgs => imgs.map(img => img.src));

		const ogUrl = links[0].href;
		const ogTitle = `@${links[1].text}`;
		const ogDescription = await thread.$eval('p span', span => span.innerText);
		const thumbnail = images[0];
		const ogImage = images[1] ?? null;
		const ogDate = await thread.$eval('time', time => time.dateTime);
		const replies = links[links.length - 1].text;
		const likes = await thread.$eval('div[role="button"] span', span => span.innerText);

		return {
			ogSiteName: 'Threads',
			ogUrl,
			favicon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/_8T3PbCSTRI.png',
			ogTitle,
			ogDescription: `${ogDescription}\n\n:speech_balloon: ${replies.split(' ')[0]} :heart: ${likes.split(' ')[0]}`,
			ogImage: ogImage ? [{ url: ogImage }] : null,
			thumbnail,
			ogDate
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