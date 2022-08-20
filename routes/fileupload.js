const express = require("express");
const router = express.Router();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const crypto = require('crypto');

require("dotenv").config();
  
  const mongouri = "mongodb://localhost:27017/vms";
  try {
    mongoose.connect(mongouri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
   
  }
  process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection", error.message);
  });
  let imageupload;
  let bucket;


    mongoose.connection.on("connected", () => {
      // var client = mongoose.connections[0].client;
      var db = mongoose.connections[0].db;
      bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "newBucket",
      });
    });
  

  const storage = new GridFsStorage({
    url: mongouri,
    options: {
      useNewUrlParser: true
    },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = imageupload = buf.toString("hex") + file.originalname
          const fileInfo = {
            filename: filename,
            bucketName: "newBucket",
          };
          resolve(fileInfo);
        });
      });
    },
  });

  const upload = multer({
    storage,
  });

  const fUpload = upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "gallery", maxCount: 8 },
  ]);
  router.post("/photos/upload", fUpload, async (req, res) => {
    res.status(200).send({ message: "uploaded", data: imageupload });
  });

  router.get("/fileinfo/:filename", (req, res) => {
    const file = bucket
      .find({
        filename: req.params.filename,
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist",
          });
        }
        bucket.openDownloadStreamByName(req.params.filename).pipe(res);
      });
  });




module.exports = router;