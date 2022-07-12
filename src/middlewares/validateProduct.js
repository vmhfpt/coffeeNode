const Product = require("../models/Product");
const { body } = require("express-validator");
const validateCustom = async (req, res, next) => {
 
  if(req.files){
    const arrayFile = ["image/jpeg", "image/jpg", "image/png"];
    const fileValid = req.files.thumb;
    const sizeFile = fileValid.size; //
    if (sizeFile > 5 * 1024 * 1024) {
      req.errorFile = "File vượt quá 5Mb" ;
    }
    if (!arrayFile.includes(fileValid.mimetype)) {
      req.errorFile = "File không hợp lệ" ;
    }
  }else if(!req.params.slug) {
      req.errorFile = "Phải có ít nhất một ảnh" ;
  }

  await body("name")
    .isLength({ min: 5 })
    .withMessage("Tên phải ít nhất 5 kí tự")
    .run(req);
  if (!req.params.slug) {
    await body("name")
      .custom((value) => {
        return Product.findOne({ name: value }).then((user) => {
          if (user) {
            return Promise.reject("Tên sản phẩm đã tồn tại");
          }
        });
      })
      .run(req);
  }
  await body("description")
    .isLength({ min: 5 })
    .withMessage("Mô tả phải ít nhất 5 kí tự")
    .run(req);

    await body("price")
    .isInt({ min: 1})
    .withMessage("Giá phải ít nhất 1đ")
    .run(req);

    await body("price_sale")
    .isInt({ min: 1})
    .withMessage("Giá ưu đãi phải ít nhất 1đ")
    .run(req);

    await body("quantity")
    .isInt({ min: 1 })
    .withMessage("Số lượng ít nhất là 1 sản phẩm")
    .run(req);

    await body("content")
    .isLength({ min: 5 })
    .withMessage("Nội dung quá ngắn")
    .run(req);
  next();
};
module.exports = validateCustom;
