const multer = require('multer')
const storage=multer.diskStorage({})
const fileFilter= (req,file,cb)=>{
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));}
console.log(file)
}
 module.exports =multer({storage,fileFilter})

 