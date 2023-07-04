const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./embetter.db', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the SQlite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS guild_modes (
    guild_id TEXT PRIMARY KEY,
    mode INTEGER
)`, (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Guild modes table created.');
});

function setGuildMode(guild_id, mode) {
	db.run('REPLACE INTO guild_modes (guild_id, mode) VALUES (?, ?)', [guild_id, mode], (err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(`Mode ${mode} set for guild ${guild_id}.`);
	});
}

function getGuildMode(guild_id, callback) {
	db.get('SELECT mode FROM guild_modes WHERE guild_id = ?', [guild_id], (err, row) => {
		if (err) {
			return console.error(err.message);
		}
		// If no results were found, row will be `undefined`, and mode will be `null`.
		const mode = row ? row.mode : null;
		callback(mode);
	});
}

module.exports = { setGuildMode, getGuildMode };
