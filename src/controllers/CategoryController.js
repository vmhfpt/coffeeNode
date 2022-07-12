const {  validationResult} = require('express-validator');
const Category = require('../models/Category');
const convertArr = require('../helpers/convertArray');
const slug = require('slug');
class CategoryController {
  destroy(req, res){
    var  id = req.body.id;
    return  Category.findById(id)
     .then((data) => {
      return Category.findByIdAndUpdate(
         data.parent_id,
            { $pull: { category_child: data._id } }
          )
          .then((dataItem) => {
            return Category.findByIdAndRemove(id)
            .then(()=> {return res.json({'status' : 'delete success'})})
            .catch((error) => { return res.json(error)})
          })
          .catch((error) => {
              res.json(error);
          });
     }).catch((error) => {
        res.json(error);
     })
  }
   
   update(req, res){
      const handleCategoryChild = (data) => {
           //console.log(data.parent_id);
           if(data.parent_id  != null){
            return Category.findByIdAndUpdate(
               data.parent_id,
                  { $pull: { category_child: data._id } }
                )
                .then((data) => {
                    return (data);
                })
                .catch((error) => {
                    res.send(error);
                });
           }
          
             
      };
      const errors = validationResult(req).array();
      var arrError = [];
      errors.map((value, key) => {
         arrError[value.param] = value.msg;
      });
      if(errors.length == 0){
         if(req.body.parent_id == 'null'){
            req.body.parent_id = null ;
          }
          Category.findOne({ slug: req.params.slug})
          .then((data) => {
             return handleCategoryChild(data);
          })
          .catch((error) => {
              return res.send(error);
          });
         Category.findOneAndUpdate({ slug: req.params.slug },{
            slug : slug(req.body.name),
            name : req.body.name,
            description : req.body.description,
            active : req.body.active,
            parent_id : req.body.parent_id, 
         } )
         .then((data) => {
            if(req.body.parent_id != null){
               return Category.findByIdAndUpdate(
                  req.body.parent_id ,
                     { $push: { category_child: data._id } },
                     { new: true, useFindAndModify: false }
                   )
                   .then((data) => {
                      return res.render('templates/category/add', {success : `Thêm danh mục ${data.name} thành công !`});
                   })
                   .catch((error) => {
                       res.send(error);
                   })
             }else {
               return res.render('templates/category/add', {success : `Thêm danh mục ${data.name} thành công !`});
         
             }
           
         })
         .catch((error) => {
             res.send(error);
         })
      
      }else {
         Category.find({})
         .then((listCategory) => {
            
            listCategory =  convertArr.multipleMongose(listCategory);
            return res.render('templates/category/edit', {  param :  req.params.slug ,arrError, dataItem : req.body,  listCategory});
         })
         .catch((error) => {

         })
        
      }
     
   }
   show(req, res){
    
     Category.find({}).then((listCategory) => {
        listCategory =  convertArr.multipleMongose(listCategory);
        Category.findOne({slug : req.params.slug})
        .then((dataItem) => {
           dataItem =  convertArr.mongoseToObject(dataItem);
           return  res.render('templates/category/edit',{param : dataItem.slug,dataItem, listCategory} );
        })
        .catch((error) => {
            res.send(error);
        })

     }).catch((error) => {
        res.send('error');
     })
   }
   index(req, res){

     Category.find({})
     .populate('parent_id', '-category_child -parent_id -_id')
      .then((data) => {
            const dataItem = convertArr.multipleMongose(data);
            return  res.render('templates/category/list', {dataItem});
      })
      .catch((error) => {
           return res.json({errors : error});
      });
   }
   create(req, res){
      Category.find({})
     .then((data) => {
           const dataItem = convertArr.multipleMongose(data);
         return  res.render('templates/category/add',{dataItem} );
     })
     .catch((error) => {
          return res.send('error');
     });
    
   
   }
   insert(req, res){
      const errors = validationResult(req).array();
      var arrError = [];
      errors.map((value, key) => {
         arrError[value.param] = value.msg;
      });
      if(errors.length == 0){
     
       if(req.body.parent_id == 'null'){
         req.body.parent_id = null ;
       }
        Category.create(req.body)
        .then((data) => {
        return Category.findByIdAndUpdate(
         req.body.parent_id,
            { $push: { category_child: data._id } },
            { new: true, useFindAndModify: false }
          )
          .then((data) => {
             return res.render('templates/category/add', {success : `Thêm danh mục ${req.body.name} thành công !`});
          })
          .catch((error) => {
              res.send(error);
          })
        })
        .catch((error) => {
            res.send(error);
        });
      }else {
         Category.find({})
         .then((data) => {
            const dataItem = convertArr.multipleMongose(data);
            
             return res.render('templates/category/add', {dataItem, arrError, old_input : req.body})
         })
         .catch((error) => {
             return (res.send('error'));
         });
        
      }
   }
}
module.exports = new CategoryController();