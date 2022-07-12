const adminUser = require("./admin/users/user");
const adminCategory = require("./admin/category/category");
const adminProduct = require("./admin/product/product");
const adminBanner = require("./admin/banner/banner");
const postHome = require("./post/Home/home");
const middleware = require("../middlewares/auth");
const UserControler = require("../controllers/UserController");
function app(app) {

  app.post("/admin/login", UserControler.auth);
  app.get("/admin/login", function (req, res) {
    
    res.render("templates/authen/login", { layout: false });
  });
  app.get("/admin/", middleware, function (req, res) {
    return res.render("templates/dashboard");
  });
  app.use("/", postHome);

 

  app.use("/admin/product/", middleware, adminProduct);
  app.use("/admin/category/", middleware, adminCategory);
  app.use("/admin/banner/", middleware, adminBanner);

  app.use("/admin/user/", middleware, adminUser);

  /* 
     app.get('/admin/login', (req, res, next) => {
        res.render('templates/authen/login', {layout: false});
      });
     app.get('/admin/', function(req, res, ){
         res.render('templates/dashboard');
      });
      app.get('/admin/add', function(req, res, ){
        res.render('templates/add');
      });
      */
}
module.exports = app;
