const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Dekode string base64
const base64EncodedKey = process.env.GOOGLE_CLOUD_KEY_BASE64;
const serviceKey = Buffer.from(base64EncodedKey, "base64").toString("utf8");

// Parse JSON key
const serviceKeyJson = JSON.parse(serviceKey);

// Buat klien Google Cloud Storage
const storage = new Storage({
  credentials: serviceKeyJson,
  projectId: serviceKeyJson.project_id,
});

// Referensi bucket Anda
const bucketName = process.env.BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Fungsi untuk mengunggah file ke GCS
const uploadFileToGCS = async (filePath) => {
  try {
    // Generate UUID for the file
    const newFileName = uuidv4();
    const ext = path.extname(filePath).toLowerCase();

    let typeFile;
    if (ext === ".jpeg" || ext === ".jpg") {
      typeFile = "image/jpeg";
    } else if (ext === ".png") {
      typeFile = "image/png";
    } else {
      throw new Error("File bukan file gambar (jpeg/png)");
    }

    // Set destination path with new file name and original extension
    const folderName = process.env.FOLDER_NAME;
    const destination = `${folderName}/${newFileName}${ext}`;

    await bucket.upload(filePath, {
      destination: destination,
      resumable: false,
      public: true,
      metadata: {
        contentType: typeFile,
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
    return publicUrl;
  } catch (err) {
    console.error("Error saat mengunggah file:", err);
    throw err;
  }
};

module.exports = { uploadFileToGCS };
