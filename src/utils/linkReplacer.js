module.exports = function replaceLink(message) {
  // Regex patterns to match URLs
  let twitterPattern = /(http[s]?:\/\/(?:www\.)?twitter\.([a-zA-Z0-9-.]+))/g;
  let instagramPattern = /(http[s]?:\/\/(?:www\.)?instagram\.([a-zA-Z0-9-.]+))/g;
  let tiktokPattern = /(http[s]?:\/\/(?:www\.)?tiktok\.([a-zA-Z0-9-.]+))/g;
  
  let wwwPattern = /(www\.)/g;

  let newMessage = message;

  // Check if the message contains a URL of the old domain and replace it
  if (twitterPattern.test(message)) {
    newMessage = newMessage.replace(twitterPattern, (url) => url.replace("twitter.", "vxtwitter."));
  }
  
  if (instagramPattern.test(message)) {
    newMessage = newMessage.replace(instagramPattern, (url) => url.replace("instagram.", "ddinstagram."));
  }

  if (tiktokPattern.test(message)) {
    newMessage = newMessage.replace(tiktokPattern, (url) => url.replace("tiktok.", "vxtiktok."));
  }

  // After domain replacement, remove 'www.' from any URL
  if (wwwPattern.test(newMessage)) {
    newMessage = newMessage.replace(wwwPattern, "");
  }

  return newMessage;
}
