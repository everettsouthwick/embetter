module.exports = function replaceLink(message) {
    const platforms = [
        {
            name: 'Instagram',
            pattern: /(http[s]?:\/\/(?:www\.)?instagram\.[a-zA-Z0-9-]+\/(?:p|stories|live|reel)(.*))/g,
			match: 'instagram.',
            replacement: 'ddinstagram.'
        },
        {
            name: 'TikTok',
            pattern: /(http[s]?:\/\/(?:www\.|vm\.)?tiktok\.[a-zA-Z0-9-]+\/([a-zA-Z0-9_\/]*))(?:\?.*)?/g,
			match: 'tiktok.',
            replacement: 'vxtiktok.'
        },
        {
            name: 'Twitter',
            pattern: /(http[s]?:\/\/(?:www\.|m\.|mobile\.)?twitter\.[a-zA-Z0-9-]+\/(?:i\/status|([a-zA-Z0-9_]+)\/status)\/([0-9]+)(\?[a-zA-Z0-9_=&-]*)?)/g,
			match: 'twitter.',
            replacement: 'vxtwitter.'
        },
        {
            name: 'YouTube',
            pattern: /(http[s]?:\/\/(?:www\.)?youtube\.[a-zA-Z0-9-]+\/shorts\/[a-zA-Z0-9_-]+(?:\?.*)?)/g,
			match: 'youtube.',
            replacement: '/video/'
        }
    ];

    let newMessage = message;
    const links = [];

    // Iterate over each platform
    for (let platform of platforms) {
        if (platform.pattern.test(message)) {
            newMessage = newMessage.replace(platform.pattern, (url) => {
                const newUrl = url.replace(platform.match, platform.replacement);
                links.push(newUrl);
                return newUrl;
            });
        }
    }

    return { fullMessage: newMessage, links: links };
};
