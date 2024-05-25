const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadoncloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;
        const cloudinary_response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        console.log("file successfuly upload on cloudinary", cloudinary_response.url);
        fs.unlinkSync(localfilepath);
        return cloudinary_response;
    } catch (error) {
        fs.unlinkSync(localfilepath); // remove the file in server for temprery store for uploadin purpose on cloudinary/cloud-storage.
        return null;
    }
};
module.exports = uploadoncloudinary;