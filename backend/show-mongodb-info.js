const mongoose = require('mongoose');
require('dotenv').config();

async function showMongoDBInfo() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log('\n📊 DATABASE INFORMATION FOR COMPASS:');
    console.log('=' * 50);
    console.log(`🏷️  Database Name: ${dbName}`);
    console.log(`🔗 Connection String: ${process.env.MONGODB_URI}`);
    console.log(`🌐 Host: localhost:27017`);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📁 COLLECTIONS IN DATABASE:');
    console.log('-' * 30);
    
    if (collections.length === 0) {
      console.log('❌ No collections found in database');
    } else {
      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        const count = await db.collection(collection.name).countDocuments();
        console.log(`${i + 1}. Collection: "${collection.name}" (${count} documents)`);
      }
    }
    
    // Specifically check for scamreports collection
    console.log('\n🎯 SCAM REPORTS COLLECTION:');
    console.log('-' * 30);
    
    const scamReportsExists = collections.find(col => col.name === 'scamreports');
    if (scamReportsExists) {
      const reportCount = await db.collection('scamreports').countDocuments();
      console.log(`✅ Found "scamreports" collection with ${reportCount} documents`);
      
      // Show sample document structure
      const sampleReport = await db.collection('scamreports').findOne({});
      if (sampleReport) {
        console.log('\n📄 SAMPLE DOCUMENT STRUCTURE:');
        console.log('-' * 40);
        console.log(`ID: ${sampleReport._id}`);
        console.log(`Title: ${sampleReport.title}`);
        console.log(`Type: ${sampleReport.scamType}`);
        console.log(`Status: ${sampleReport.status}`);
        console.log(`Created: ${sampleReport.createdAt}`);
        console.log(`Fields available:`, Object.keys(sampleReport).join(', '));
      }
    } else {
      console.log('❌ "scamreports" collection not found');
    }
    
    console.log('\n📋 COMPASS NAVIGATION STEPS:');
    console.log('=' * 50);
    console.log('1. Open MongoDB Compass');
    console.log('2. Connect to: mongodb://localhost:27017');
    console.log(`3. Look for database: "${dbName}"`);
    console.log('4. Expand the database');
    console.log('5. Click on collection: "scamreports"');
    console.log('6. You should see all your scam reports there!');
    
    console.log('\n💡 TROUBLESHOOTING:');
    console.log('-' * 20);
    console.log('• If you don\'t see the database, try refreshing Compass');
    console.log('• Make sure you\'re connected to localhost:27017');
    console.log('• The collection name is "scamreports" (lowercase, plural)');
    console.log('• If still not visible, try disconnecting and reconnecting in Compass');

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    console.log('\n🔧 POSSIBLE ISSUES:');
    console.log('• MongoDB service might not be running');
    console.log('• Check if MongoDB is started on your system');
    console.log('• Verify connection string in .env file');
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

showMongoDBInfo();
