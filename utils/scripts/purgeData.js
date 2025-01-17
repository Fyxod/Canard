// script written by gpt as I am too lazy to do grunt work

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URI = process.env.MONGODB_URI; // Replace with your database URI

const deleteAllCollections = async () => {
  try {
    // Connect to the database
    await mongoose.connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");

    // Get all collections in the database
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    // Drop each collection
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`Dropped collection: ${collection.name}`);
    }

    console.log("All collections have been dropped.");
  } catch (error) {
    console.error("Error while dropping collections:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the function
deleteAllCollections();
