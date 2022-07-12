const Product = require("../models/Product");
const Banner = require("../models/Banner");
const convertArr = require("../helpers/convertArray");
class PostController {
  infor(req, res){
    return res.render("templates/contact");
  }
  show(req, res) {
    return Product.find({})
      .sort({ createdAt: "desc", test: 1 })
      .limit(6)
      .then((dataProduct) => {
        dataProduct = convertArr.multipleMongose(dataProduct);
        Product.findOne({ slug: req.params.slug })
        .populate('category_id',
        "-_id -description -category_child -active -parent_id -createdAt -updatedAt"
        )
          .then((dataItem) => {
            dataItem = convertArr.mongoseToObject(dataItem);
            return res.render("templates/detail", { dataItem, dataProduct });
          })
          .catch((error) => {
            return res.send(error);
          });
      })
      .catch((error) => {
        return res.send(error);
      });
  }
  index(req, res) {
    Banner.find({})
      .then((dataBanner) => {
        dataBanner = convertArr.multipleMongose(dataBanner);
        Product.find({})
          .sort({ createdAt: "desc", test: 1 })
          .populate(
            "category_id",
            "-_id -description -category_child -active -parent_id -createdAt -updatedAt"
          )
          .then((dataProduct) => {
            dataProduct = convertArr.multipleMongose(dataProduct);
            return res.render("templates/home", { dataBanner, dataProduct });
          })
          .catch((error) => {
            return res.send(error);
          });
      })
      .catch((error) => {
        return res.send(error);
      });
  }
}
module.exports = new PostController();
