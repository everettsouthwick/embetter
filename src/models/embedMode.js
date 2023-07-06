const EmbedMode = {
	REPLACE: 0,
	REPLY: 1,
	ASK: 2,
	MANUAL: 3,

	getModeName(value) {
		for (const modeName in this) {
			if (this[modeName] === value) {
				return modeName;
			}
		}
		throw new Error(`No mode found for value ${value}`);
	},
};

module.exports = EmbedMode;