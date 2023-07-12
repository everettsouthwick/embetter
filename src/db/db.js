const { MongoClient, ServerApiVersion } = require('mongodb');
const { mongoDbUri } = require('../../config.json');

const client = new MongoClient(mongoDbUri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

let db;

async function connect() {
	try {
		await client.connect();
		db = client.db('embetter');
	}
	catch (err) {
		console.error(err);
	}
	return db;
}

module.exports = connect;
