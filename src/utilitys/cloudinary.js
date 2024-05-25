const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file for diskstorage with multer
// const uploadoncloudinary = async (localfilepath) => {
//     try {
//         if (!localfilepath) return null;
//         const cloudinary_response = await cloudinary.uploader.upload(localfilepath, {
//             resource_type: "auto"
//         })
//         console.log("file successfuly upload on cloudinary", cloudinary_response.url);
//         fs.unlinkSync(localfilepath);
//         return cloudinary_response;
//     } catch (error) {
//         fs.unlinkSync(localfilepath); // remove the file in server for temprery store for uploadin purpose on cloudinary/cloud-storage.
//         return null;
//     }
// };

// Upload file for memoryStorage with multer
const uploadBufferToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                console.log("File successfully uploaded to Cloudinary", result.secure_url);
                resolve(result);
            }
        });

        // Convert buffer to a readable stream and pipe it to Cloudinary's upload stream
        const { Readable } = require('stream');
        const stream = Readable.from(fileBuffer);
        stream.pipe(uploadStream);
    });
};
module.exports = {
    uploadBufferToCloudinary
};