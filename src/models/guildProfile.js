class GuildProfile {
	constructor(id, mode, platforms) {
		this.id = id;
		this.mode = mode;
		this.platforms = platforms || {};
	}
}

module.exports = { GuildProfile };
