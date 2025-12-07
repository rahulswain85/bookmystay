const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


// 1. Ensure dotenv is configured before using the variable
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// 2. Update this line to use the Atlas URL
// OLD: const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"
const mongo_url = process.env.MONGO_URI;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initializeDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    // Note: Ensure this Owner ID exists in your new Atlas User collection
    owner: "693474a07cab92cdb89dfbaa",
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was Initialized!");
};

initializeDB();
