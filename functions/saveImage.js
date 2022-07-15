const fs = require("fs")

const saveImage = (base64Image, name) => {
   // Remove header
   let image = base64Image.split(";base64,").pop()

   fs.writeFile(name, image, { encoding: "base64" }, function (err) {
      console.log("File created")
   })
}

module.exports = {
   saveImage,
}
