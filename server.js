// server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { IncomingForm } = require('formidable');
const cors = require('cors')

const config = require("./config")

const app = express();
app.use(cors());

const rootPath = path.join(process.cwd(), config.foldername, 'uploads');

if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath, { recursive: true });
}

  
app.use('/uploads', express.static(rootPath));

// Custom file upload handling
app.post('/upload/:folder', (req, res) => {
  
const folder = req.params.folder;

  if(!folder){
    return res.status(400).json({success:true, error:"Please provide a folder name"});
  }
  
  const uploadPath = path.join(rootPath, folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}


 try {
  const form = new IncomingForm();
  form.uploadDir = uploadPath;
  form.keepExtensions = true; 

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({success:false, error:err});
      return;
    }

    if(!files?.files){
      return res.status(400).json({success:false, error:"Please provide a file"});
    }

    const updatedFiles = Object.fromEntries(
      Object.entries(files).map(([field, fileArray]) => {
        const newFiles = Array.isArray(fileArray) ? fileArray : [fileArray];
        return [field, newFiles.map(file => {
          const ext = path.extname(file.originalFilename); 
          const newFilePath = path.join(uploadPath, `${file.newFilename}${ext}`);
          fs.renameSync(file.filepath, newFilePath);
          return {
            ...file,
            filepath: newFilePath,
            originalFilename: file.originalFilename,
            newFilename: `${file.newFilename}${ext}`
          };
        })];
      })
    );

    const uploadedItems = updatedFiles['files'];
    let finalFiles = [];

    for (const file of uploadedItems) {
      const newname = file?.newFilename;
      const ogName = file?.originalFilename;
      const mimetype = file?.mimetype;
      const size = file?.size;

      finalFiles.push({
        name: newname,
        ogName: ogName,
        mimetype: mimetype,
        size: size
      });
    }
    
    return  res.status(200).json({success:true, files: finalFiles });
  });
 } catch (error) {
 return res.status(500).json({success:true, error:error});
 }
});


app.listen(config.PORT, () => {
  console.log(`📦 Drive Running on PORT: ${config.PORT}`);
});
