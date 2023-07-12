const platforms = [
  {
    name: 'Instagram',
    pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?instagram\.[^?]+)/g,
    replacement: (url) => url.replace('instagram.', 'ddinstagram.'),
  },
  {
    name: 'Threads',
    pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?threads\.[^?]+)/g,
    embed: {
      author: {
        name: 'Threads',
        url: 'https://threads.net/',
        iconURL: 'https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/_8T3PbCSTRI.png',
      }
    }
  },
  {
    name: 'TikTok',
    pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?tiktok\.[^?]+)/g,
    replacement: (url) => url.replace('tiktok.', 'vxtiktok.'),
  },
  {
    name: 'Twitter',
    pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?twitter\.[^?]+)/g,
    replacement: (url) => url.replace('twitter.', 'vxtwitter.'),
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
    },
  },
  {
    name: 'The New York Times',
    pattern: /(https?:\/\/([a-zA-Z0-9-]+\.)?nytimes\.[^?]+)/g,
    replacement: (url) => `https://archive.today/newest/${url}`,
    embed: {
      author: {
        name: 'The New York Times',
        url: 'https://www.nytimes.com/',
        iconURL: 'https://www.nytimes.com/vi-assets/static-assets/ios-default-homescreen-57x57-dark-b395ebcad5b63aff9285aab58e31035e.png',
      },
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
        iconURL: 'https://www.washingtonpost.com/touch-icon-iphone.png',
      },
    },
  },
]

module.exports = {
  platforms
}