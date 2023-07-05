const { MongoClient, ServerApiVersion } = require('mongodb');
const { mongoDbUri } = require('../../config.json')

const client = new MongoClient(mongoDbUri, {
	serverApi: {
	  version: ServerApiVersion.v1,
	  strict: true,
	  deprecationErrors: true,
	}
});

let db;

async function run() {
	try {
	  await client.connect();
      db = client.db("embetter");
	} catch (err) {
		console.error(err);
	}
}
run().catch(console.dir);

async function setGuildMode(guild_id, mode) {
  const collection = db.collection('guild_modes');
  return collection.updateOne({ _id: guild_id }, { $set: { mode: mode } }, { upsert: true });
}

async function getGuildMode(guild_id) {
  const collection = db.collection('guild_modes');
  return collection.findOne({ _id: guild_id });
}

module.exports = { setGuildMode, getGuildMode };
