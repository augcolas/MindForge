const MongoClient = require('mongodb').MongoClient;

// Connection URL
const client = new MongoClient('mongodb://root:password@localhost:27017');

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');

  //create db
  const db = await client.db('MindForge');
  if(db) {
    await db.dropDatabase();
  }
  //create collections
  const rooms = await db.createCollection('rooms');

  return 'done';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());