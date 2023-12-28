const fs = require('fs');
const path = require('path');

function listFilesWithExtension(directoryPath, extension) {
  try {
    const files = fs.readdirSync(directoryPath);
    const filteredFiles = files.filter((file) => path.extname(file) === `.${extension}`);
    console.log(`Files with extension .${extension} in directory ${directoryPath}:`);
    filteredFiles.forEach((file) => {
      console.log(file);
    });

  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
}





module.exports = {
  listFilesWithExtension
};

