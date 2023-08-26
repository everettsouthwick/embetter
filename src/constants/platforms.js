const platforms = [
	{
		name: 'Instagram',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?instagram\.[^?]+)/g,
		replacement: (url) => url.replace('instagram.', 'ddinstagram.'),
	},
	{
		name: 'Threads',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?threads\.[^?]+)/g,
		replacement: (url) => url.replace('threads.', 'vxthreads.'),
	},
	{
		name: 'TikTok',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?tiktok\.[^?]+)/g,
		replacement: (url) => url.replace('tiktok.', 'vxtiktok.'),
	},
	{
		name: 'Twitter',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)*(twitter|x)\.[a-zA-Z0-9-]+[^?]+)/g,
		replacement: (url) => url.replace(/(twitter|x)\./, 'vxtwitter.'),
	},
	{
		name: 'Bluesky',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?bsky\.app[^?]+)/g,
		replacement: (url) => url.replace('bsky.', 'psky.'),
	},
	{
		name: 'The Atlantic',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?theatlantic\.[^?]+)/g,
		replacement: (url) => `https://archive.today/newest/${url}`,
		embed: {
			author: {
				name: 'The Atlantic',
				url: 'https://www.theatlantic.com/',
				iconURL: 'https://cdn.theatlantic.com/_next/static/images/apple-touch-icon-default-b504d70343a9438df64c32ce339c7ebc.png',
			},
			color: [231, 19, 26],
		},
	},
	{
		name: 'Bloomberg',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?bloomberg\.[^?]+)/g,
		replacement: (url) => `https://archive.today/newest/${url}`,
		embed: {
			author: {
				name: 'Bloomberg',
				url: 'https://www.bloomberg.com/',
				iconURL: 'https://www.bloomberg.com/favicon-black.png',
			},
			color: [0, 0, 0],
		},
	},
	{
		name: 'The New York Times',
		pattern: /(https?:\/\/www\.nytimes\.com\/\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.html)|(https?:\/\/www\.nytimes\.com\/article\/[a-zA-Z0-9-]+\.html)/g,
		replacement: (url) => `https://archive.today/newest/${url}`,
		embed: {
			author: {
				name: 'The New York Times',
				url: 'https://www.nytimes.com/',
				iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/New_York_Times_T_icon.svg/139px-New_York_Times_T_icon.svg.png',
			},
			color: [0, 0, 0],
		},
	},
	{
		name: 'Rolling Stone',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?rollingstone\.[^?]+)/g,
		replacement: (url) => `https://archive.today/newest/${url}`,
		embed: {
			author: {
				name: 'Rolling Stone',
				url: 'https://www.rollingstone.com/',
				iconURL: 'https://www.rollingstone.com/wp-content/uploads/2022/08/cropped-Rolling-Stone-Favicon.png?w=180',
			},
			color: [230, 0, 24],
		},
	},
	{
		name: 'The Wall Street Journal',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?wsj\.[^?]+)/g,
		replacement: (url) => `https://archive.today/newest/${url}`,
		embed: {
			author: {
				name: 'The Wall Street Journal',
				url: 'https://www.wsj.com/',
				iconURL: 'https://s.wsj.net/media/wsj_apple-touch-icon-180x180.png',
			},
			color: [0, 0, 0],
		},
	},
	{
		name: 'The Washington Post',
		pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?washingtonpost\.[^?]+)/g,
		replacement: (url) => `https://archive.today/newest/${url}`,
		embed: {
			author: {
				name: 'The Washington Post',
				url: 'https://www.washingtonpost.com/',
				iconURL: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Washington_Post_favicon_white-on-black.jpg',
			},
			color: [0, 0, 0],
		},
	},
];

module.exports = platforms;
