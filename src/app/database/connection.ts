import config from '../../config/config';
import { MongoClient, Document } from 'mongodb';

class DatabaseConnector {
  private mongoClient!: MongoClient;

  // Establish a connection to the MongoDB server
  async initializeConnection() {
    this.mongoClient = new MongoClient(config.database.url, {
      monitorCommands: true,
      connectTimeoutMS: 1000,
      maxPoolSize: 10,
      retryWrites: true,
    });

    try {
      await this.mongoClient.connect();
      console.log(
        `\nSuccessfully connected to the database: ${config.database.name}`
      );
    } catch (error) {
      console.error(`Failed to connect to the database:`, error);
      process.exit(1);
    }
  }

  // Fetch a specific collection from the database
  fetchCollection<T extends Document>(collectionName: string) {
    if (!this.mongoClient) {
      throw new Error(
        'Database connection not initialized. Call initializeConnection() first.'
      );
    }

    return this.mongoClient
      .db(config.database.name)
      .collection<T>(collectionName);
  }
}

export default new DatabaseConnector();
