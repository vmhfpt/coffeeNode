const Category = require('../models/Category');
const { body } = require('express-validator');
const validateCustom =  async (req, res, next) => {
    await  body('name')
    .isLength({ min: 5 })
    .withMessage('Tên phải ít nhất 5 kí tự').run(req);
  if(!req.params.slug){
    await body('name').custom(value => {
      return Category.findOne({name : value}).then(user => {
        if (user) {
          return Promise.reject('Tên danh mục đã tồn tại');
        }
      });
    }).run(req);
  }
     await body('description')
    .isLength({ min: 5 })
    .withMessage('Mô tả phải ít nhất 5 kí tự').run(req);
    next();
}
module.exports = validateCustom ;