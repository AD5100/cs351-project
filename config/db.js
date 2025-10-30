const mongoose = require('mongoose');

async function connectDB(uri)
{
  try
  {
    await mongoose.connect(uri, {serverSelectionTimeoutMS: 10000});
    console.log('MongoDB connected successfully');
  }
  catch (errors)
  {
    console.error('MongoDB connection failed:', errors.message);
    process.exit(1);
  }
}

module.exports = connectDB;
