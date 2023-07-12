const Mode = {
	REPLACE: 0,
	REPLY: 1,
	ASK: 2,
	MANUAL: 3,

	getModeName(value) {
		for (const modeName in this) {
			if (this[modeName] === value) {
				return this.toProperCase(modeName);
			}
		}
		throw new Error(`No mode found for value ${value}`);
	},

	toProperCase(str) {
		return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	}
};

module.exports = {
	Mode
}