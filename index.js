// server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { IncomingForm } = require('formidable');
const cors = require('cors')

const app = express();
app.use(cors());

const uploadPath = path.join(process.cwd(), 'drive', 'uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  
// Serve static files from a custom folder
app.use('/uploads', express.static(uploadPath));

// Custom file upload handling
app.post('/upload', (req, res) => {
  const form = new IncomingForm();
  form.uploadDir = uploadPath;
  form.keepExtensions = false; // Do not rely on keepExtensions

 try {
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({success:true, error:err});
      return;
    }

    // Handle file extensions manually
    const updatedFiles = Object.fromEntries(
      Object.entries(files).map(([field, fileArray]) => {
        const newFiles = Array.isArray(fileArray) ? fileArray : [fileArray];
        return [field, newFiles.map(file => {
          const ext = path.extname(file.originalFilename); // Get file extension
          const newFilePath = path.join(uploadPath, `${file.newFilename}${ext}`);
          fs.renameSync(file.filepath, newFilePath); // Rename file with extension
          return {
            ...file,
            filepath: newFilePath,
            originalFilename: file.originalFilename,
            newFilename: `${file.newFilename}${ext}`
          };
        })];
      })
    );

    res.status(200).json({success:true, file: updatedFiles?.file[0]?.newFilename });
  });
 } catch (error) {
  res.status(500).json({success:true, error:error});
 }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Drive Running on PORT: ${port}`);
});
