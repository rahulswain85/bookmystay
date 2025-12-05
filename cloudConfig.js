const cloudinary = require("cloudinary").v2; // <--- The .v2 is CRITICAL to fix the "undefined" error
const fs = require("fs");
require("dotenv").config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// 2. Define the Upload Function (Strategy B)
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File uploaded successfully, delete local file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // If upload fails, delete the local file so we don't pile up garbage
    console.log(error)
    fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = { uploadOnCloudinary };
