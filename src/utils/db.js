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
	return new Promise((resolve, reject) => {
		db.run('REPLACE INTO guild_modes (guild_id, mode) VALUES (?, ?)', [guild_id, mode], (err) => {
			if (err) {
				console.error(err.message);
				reject(err);
			} else {
				console.log(`Mode ${mode} set for guild ${guild_id}.`);
				resolve();
			}
		});
	});
}

function getGuildMode(guild_id) {
	return new Promise((resolve, reject) => {
		db.get('SELECT mode FROM guild_modes WHERE guild_id = ?', [guild_id], (err, row) => {
			if (err) {
				console.error(err.message);
				reject(err);
			} else {
				// If no results were found, row will be `undefined`, and mode will be `null`.
				const mode = row ? row.mode : null;
				resolve(mode);
			}
		});
	});
}

module.exports = { setGuildMode, getGuildMode };
