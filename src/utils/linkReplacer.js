module.exports = function replaceLink(message) {
	// Regex patterns to match URLs
	const instagramPattern = /(http[s]?:\/\/(?:www\.)?instagram\.[a-zA-Z0-9-]+\/(?:[a-zA-Z0-9_.]+\/(?:stories|live|p|reel)\/)?[a-zA-Z0-9_-]+(?:\?.*)?)/g;
  const tiktokPattern = /(http[s]?:\/\/(?:www\.)?tiktok\.[a-zA-Z0-9-]+\/((@([a-zA-Z0-9_.]+)(\/video\/[0-9]+)?)|(t\/ZT[a-zA-Z0-9_]+\/))?(?:\?.*)?)/g;
	const twitterPattern = /(http[s]?:\/\/(?:www\.|m\.|mobile\.)?twitter\.[a-zA-Z0-9-]+\/(?:i\/status|([a-zA-Z0-9_]+)\/status)\/([0-9]+)(\?[a-zA-Z0-9_=&-]*)?)/g;

	let newMessage = message;

	// Check if the message contains a URL of the old domain and replace it
	if (instagramPattern.test(message)) {
		newMessage = newMessage.replace(instagramPattern, (url) => url.replace('instagram.', 'ddinstagram.'));
	}

	if (tiktokPattern.test(message)) {
		newMessage = newMessage.replace(tiktokPattern, (url) => url.replace('tiktok.', 'vxtiktok.'));
	}


	if (twitterPattern.test(message)) {
		newMessage = newMessage.replace(twitterPattern, (url) => url.replace('twitter.', 'vxtwitter.'));
	}

	return newMessage;
};