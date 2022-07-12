const Banner = require("../models/Banner");
const { body } = require("express-validator");
const validateCustom = async (req, res, next) => {
 
  if(req.files){
    const arrayFile = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const fileValid = req.files.thumb;
    const sizeFile = fileValid.size; //
    if (sizeFile > 5 * 1024 * 1024) {
      req.errorFile = "File vượt quá 5Mb" ;
    }
    if (!arrayFile.includes(fileValid.mimetype)) {
      req.errorFile = "File không hợp lệ" ;
    }
  }else if(!req.params.id) {
      req.errorFile = "Phải có ít nhất một ảnh" ;
  }

  await body("name")
    .isLength({ min: 5 })
    .withMessage("Tên phải ít nhất 5 kí tự")
    .run(req);
  if (!req.params.id) {
    await body("name")
      .custom((value) => {
        return Banner.findOne({ name: value }).then((user) => {
          if (user) {
            return Promise.reject("Tên banner đã tồn tại");
          }
        });
      })
      .run(req);
  }
  await body("description")
    .isLength({ min: 5 })
    .withMessage("Mô tả phải ít nhất 5 kí tự")
    .run(req);
    await body("url")
    .isLength({ min: 5 })
    .withMessage("Liên kết banner không hợp lệ")
    .run(req);

  next();
};
module.exports = validateCustom;
