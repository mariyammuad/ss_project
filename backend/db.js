// // db.js
// const { MongoClient } = require('mongodb');
// const config = require('./config');

// const client = new MongoClient(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });

// const connectDB = async () => {
//     try {
//         await client.connect();
//         console.log("MongoDB Connected!");
//     } catch (error) {
//         console.error("MongoDB connection failed", error);
//         process.exit(1);
//     }
// };

// module.exports = { connectDB, client };

require('dotenv').config(); // Load environment variables from .env file
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI; // Use the environment variable

// Create a MongoClient instance and connect to the Atlas cluster
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect(); // Directly connect without checking isConnected
    console.log("Connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas:", error);
    throw error;
  }
}

// Export the client and connectToDatabase function
module.exports = { client, connectToDatabase };
