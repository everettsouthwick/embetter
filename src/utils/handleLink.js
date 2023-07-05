const { EmbedBuilder } = require('discord.js');
const { fetchWebsiteDetails } = require('./fetchWebsite.js');
const { platforms } = require('./platforms.js');
const { buildEmbed } = require('./buildEmbed.js');

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}

function stripQueryString(url) {
    const urlObject = new URL(url);
    return urlObject.origin + urlObject.pathname;
}

function getPlatform(message) {
    for (const platform of platforms) {
        if (platform.pattern.test(message)) {
            return platform;
        }
    }
    return null;
}

function replaceLink(message, platform) {
    const originalUrl = message.match(platform.pattern)[0];
    const newMessage = message.replace(platform.pattern, platform.replacement);
    const newUrl = platform.replacement(originalUrl);

    return {newMessage, originalUrl, newUrl};
}

async function handleEmbed(platform, originalUrl, newUrl) {
    let embed = null;
    if (platform.embed) {
        try {
            embed = await buildEmbed(platform, originalUrl, newUrl);
        }
        catch (error) {
            console.error('Error building embed for', platform.name, ':', error);
        }
    }
    return embed;
}

async function processLink(message) {
    let newMessage = message;
    const links = [];
    const embeds = [];

    const platform = getPlatform(message);
    if (platform) {
        const replacementResult = replaceLink(message, platform);
        newMessage = replacementResult.newMessage;
        const embed = await handleEmbed(platform, replacementResult.originalUrl, replacementResult.newUrl);
        if (embed) {
            embeds.push(embed);
        } else {
            links.push(replacementResult.newUrl);
        }
    }

    return { fullMessage: newMessage, links: links, embeds: embeds };
}

async function processArchive(link) {
    const links = [];
    const embeds = [];

    if (!isValidUrl(link)) {
        throw new Error('Invalid URL');
    }

    const strippedLink = stripQueryString(link);
    const platform = {
        name: 'Archive',
        pattern: new RegExp(`(${strippedLink})`, 'g'),
        replacement: (url) => `https://archive.today/newest/${url}`
    };
    
    const newUrl = platform.replacement(strippedLink);
    let embed;

    try {
        embed = await buildEmbed(platform, strippedLink, newUrl);
        embeds.push(embed);
    }
    catch (error) {
        console.error('Error building embed for', platform.name, ':', error);
    }
    
    return { links: links, embeds: embeds };
}

module.exports = {
    processLink,
    processArchive
};
