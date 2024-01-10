// const mongoose = require("mongoose");
// // const initData = require("./data.js");
// // const data = require('./data.js');
// const sampleListings = require("./data.js");

// const Listing=require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main().then(() => {
//     console.log("connected to DB");
// }).catch(err => {
//     console.log(err);
// });
// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

// const initDB=async ()=>{
//     await Listing.deleteMany({});
//     initData.data=initData.data.map((obj)=>({...obj,owner:"653e385defb40644d6776411"}));
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
// };

// initDB();
const mongoose = require("mongoose");
const sampleListings = require("./data.js"); // Import the sampleListings array

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
  console.log("Connected to DB");
}).catch(err => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    // Use sampleListings directly here to insert into the database
    const listingsWithOwner = sampleListings.map(obj => ({ ...obj, owner: "653e385defb40644d6776411" }));
    await Listing.insertMany(listingsWithOwner);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};


initDB();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/your_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Connection Error:', err));

// Listing Schema setup (Replace 'Listing' with your schema name)
const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  country: String,
  // Other fields...
});

const Listing = mongoose.model('Listing', listingSchema);

// // Search endpoint for listings
// app.get('/listings/search', async (req, res) => {
//   const searchQuery = req.query.q; // Assuming the query parameter is 'q' for the search term

//   try {
//     // Search for listings by country or name
//     const filteredListings = await Listing.find({
//       $or: [
//         { country: { $regex: new RegExp(searchQuery, 'i') } }, // Search by country
//         { title: { $regex: new RegExp(searchQuery, 'i') } }    // Search by title or name
//       ]
//     });

//     res.json({ listings: filteredListings });
//   } catch (error) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

