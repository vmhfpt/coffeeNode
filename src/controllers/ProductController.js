const path = require('path');
const fs = require('fs');
const {  validationResult} = require('express-validator');
const Category = require('../models/Category');
const Product = require('../models/Product');
const convertArr = require('../helpers/convertArray');
const slug = require('slug');
class ProductController {
   destroy(req, res){
     Product.findById(req.body.id)
     .then((dataItem) => {
         var filePath = path.join(__dirname + '\\..\\public\\img\\products\\' + dataItem.thumb ) ;
         fs.unlinkSync(filePath);
         return Product.findByIdAndRemove(dataItem._id)
         .then(()=> {return res.json({'status' : 'delete success'})})
         .catch((error) => { return res.json(error)});
     })
     .catch((error) => {
         return res.json(error);
     });
   }
   update(req, res){
      
      var arrError = [];
     
      const errors = validationResult(req).array();
      errors.map((value, key) => {
         arrError[value.param] = value.msg;
      });
      if(req.errorFile){
            arrError['thumb'] = req.errorFile;
      }
      if(errors.length == 0 && !req.errorFile){
         

       if(req.files){
         var file;
         var ramdomName = (Math.random() + 1).toString(36).substring(7);
           Product.findOne({slug : req.params.slug})
           .then((data) => {
         
              var filePath = path.join(__dirname + '\\..\\public\\img\\products\\' + data.thumb ) ;
              fs.unlinkSync(filePath);


              file = req.files.thumb;
              file.mv(path.join(__dirname, '\\..\\public\\img\\products\\') + (ramdomName + file.name), function(error){
                 if(error){
                    return res.send(error);
                 }
             });
           })
           .catch((error) => {
              return res.send(error);
           })
         
       }
    return   Product.findOneAndUpdate({slug : req.params.slug}, {
         name : req.body.name,
         description: req.body.description,
         price: req.body.price,
         price_sale: req.body.price_sale,
         quantity: req.body.quantity,
         category_id: req.body.category_id,
         active: req.body.active,
         content: req.body.content,
         slug : slug(req.body.name),
      }).then((data) => {
     
         if(file){
          return  Product.findOneAndUpdate({slug : slug(req.body.name)}, {
               thumb : (ramdomName + file.name)
            })
            .then((dataItem) => {
                return res.redirect('/admin/product/list');
            })
            .catch((error) => {
               return res.send(error);
            })
         }else {
            return res.redirect('/admin/product/list');
         }
      })
      .catch((error) => {
          return res.send(error);
      })


         
      }else {
         Product.findOne({slug : req.params.slug})
         .then((data) => {
            req.body.thumb = data.thumb;
            req.body.slug = data.slug;
            req.body.name = data.name;
              Category.find({})
              .then((listCategory) => {
               listCategory =  convertArr.multipleMongose(listCategory);
               return res.render('templates/product/edit', {arrError,dataItem : req.body, listCategory});
              })
         })
         .catch((error) => {
            return res.send(error);
         })
      }

   }
   show(req, res){
       Product.findOne({slug : req.params.slug})
     
       .then((dataItem) => {
           dataItem = convertArr.mongoseToObject(dataItem);
           Category.find({})
           .then((listCategory) => {
               listCategory =  convertArr.multipleMongose(listCategory);
               return res.render('templates/product/edit', {dataItem, listCategory});
           })
           .catch((error) => {
              return res.send(error);
           })
           
       })
       .catch((error) => {
          return res.send(error);
       })
   }
   index(req, res){
      Product.find({})
      .populate('category_id')
      .then((dataItem) => {
         dataItem =  convertArr.multipleMongose(dataItem);
         return res.render('templates/product/list', {dataItem});
      })
      .catch((error) => {
         res.send(error);
      })
   }
     create(req, res){
        Category.find({})
        .then((dataItem) => {
         dataItem =  convertArr.multipleMongose(dataItem);
         return res.render('templates/product/add', {dataItem});
        })
        .catch((error) => {
         return( res.send(error));
        })
        
     }
     insert(req, res){

      const errors = validationResult(req).array();
      var arrError = [];
      errors.map((value, key) => {
         arrError[value.param] = value.msg;
      });
      if(req.errorFile){
         arrError['thumb'] = req.errorFile;
      }

      if(errors.length == 0 && !req.errorFile){
          let file;
          let ramdomName = (Math.random() + 1).toString(36).substring(7);
        if(req.files){
            file = req.files.thumb;
            file.mv(path.join(__dirname, '\\..\\public\\img\\products\\') + (ramdomName + file.name), function(error){
               if(error){
                  res.send(error);
               }
           })
        }
   
        Product.create({
         name : req.body.name,
         description: req.body.description,
         price: req.body.price,
         price_sale: req.body.price_sale,
         quantity: req.body.quantity,
         category_id: req.body.category_id,
         active: req.body.active,
         content: req.body.content,
         thumb : (ramdomName + file.name),
        })
        .then((data) => {
         return res.render('templates/product/add', {success : `Thêm sản phẩm ${data.name} thành công !`});
        })
        .catch((error) => {
         return    res.send(error);
        })

       

      }else {
         Category.find({})
         .then((dataItem) => {
          dataItem =  convertArr.multipleMongose(dataItem);
          return res.render('templates/product/add', { dataItem,arrError, old_input : req.body});
         })
         .catch((error) => {
          return( res.send(error));
         })
        
      }
     }
}
module.exports = new ProductController();