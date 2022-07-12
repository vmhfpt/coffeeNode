const Product = require("../models/Product");
const Category = require("../models/Category");
const convertArr = require("../helpers/convertArray");
class DetailController {
  showDetail(req, res) {
   var  pagination = {
      currentPage: 0,
      sumPage: 0,
      total : 0,
    };
    Category.findOne({ slug: req.params.slug }).then((data) => {
      data = convertArr.mongoseToObject(data);
      Product.find({ category_id: data._id })
        .sort({ createdAt: "desc", test: 1 })
        .populate("category_id")
        .then((dataProduct) => {
          dataProduct = convertArr.multipleMongose(dataProduct);
          Category.findOne({ slug: req.params.category })
            .populate("category_child")
            .then((dataCategory) => {
              dataCategory = convertArr.multipleMongose(
                dataCategory.category_child
              );
              return res.render("templates/category", {
                pagination,
                slug: req.params.category,
                data,
                dataCategory,
                dataProduct,
              });
            });
        });
    });
  }
  show(req, res) {
    Category.findOne({ slug: req.params.slug }).then((data) => {
      data = convertArr.mongoseToObject(data);
      Category.find()
        .where("_id")
        .in(data.category_child)
        .then((dataCategory) => {
          // return res.json(dataCategory);
          dataCategory = convertArr.multipleMongose(dataCategory);
          Product.find({})
            .where("category_id")
            .in(data.category_child)
            .then((total) => {
              if (!req.query.page) {
                req.query.page = 1;
              }
              var limit = 6;
              var pagination = {
                currentPage: req.query.page,
                sumPage: Math.round(total.length / limit),
                total : total.length
              };
              Product.find({})
                .where("category_id")
                .in(data.category_child)
                .populate(
                  "category_id",
                  "-_id -description -category_child -active -parent_id -createdAt -updatedAt"
                )
                .sort({ createdAt: "desc", test: 1 })
                .skip((req.query.page - 1) * limit)
                .limit(limit)
                .then((dataProduct) => {
                  dataProduct = convertArr.multipleMongose(dataProduct);
                  return res.render("templates/category", {pagination, slug : data.slug,data, dataCategory, dataProduct});
                });
            });
        });
    });
    /*
      if(!req.query.page){
    req.query.page = 1;
   }
    Product.find({})
    .then((total) => {
      var limit = 2;
       var pagination =  { currentPage : req.query.page, sumPage : (total.length/2)}
       Product.find({})
       .sort({ createdAt: "desc", test: 1 })
       .skip((req.query.page - 1) * limit)
       .limit(limit)
       .then((dataProduct) => {
          return res.json(dataProduct);
       })
    })
    */
    /*   Category.findOne({slug : req.params.slug})
       .then((data) => {
        data = convertArr.mongoseToObject(data);
            Category.find().where('_id').in(data.category_child)
            .then((dataCategory) => {
                // return res.json(dataCategory);
                dataCategory = convertArr.multipleMongose(dataCategory);
                Product.find().where('category_id').in(data.category_child)
                .populate('category_id',
                "-_id -description -category_child -active -parent_id -createdAt -updatedAt"
                )
                
                .then((dataProduct) => {
                  dataProduct = convertArr.multipleMongose(dataProduct);
                  return res.render("templates/category", {slug : data.slug,data, dataCategory, dataProduct});
                })
            })
       })*/
  }
}
module.exports = new DetailController();
