const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET_NAME,
    
      key: function (req, file, cb) {
        console.log('req body', req);
        const folder = req.headers.folder;
        const subfolder = req.headers.subfolder; 
        console.log('subfolder', subfolder);
        const uniqueName = Date.now() + '-' + file.originalname;
        const key = `${folder}/${subfolder}/${uniqueName}`;
        cb(null, key);
      }
    })
  });
  
  const uploadFiles = upload.array('files');
  const getGltfFile = (files) => {
    console.log('files in getGltf', files);
    return files.find(file => file.originalname.endsWith('.gltf'));
  };

  
  const deleteFolder = (folder, subfolder) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `${folder}/${subfolder}/`
    };
  
    return new Promise((resolve, reject) => {
      s3.listObjectsV2(params, (err, data) => {
        if (err) {
          return reject(err);
        }
  
        if (data.Contents.length === 0) {
          return resolve('No files to delete');
        }
  
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Delete: { Objects: [] }
        };
  
        data.Contents.forEach(({ Key }) => {
          deleteParams.Delete.Objects.push({ Key });
        });
  
        s3.deleteObjects(deleteParams, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    });
  };
  
  module.exports = { uploadFiles, getGltfFile, deleteFolder };