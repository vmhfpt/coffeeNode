const {  validationResult} = require('express-validator');
const Banner = require('../models/Banner');
const convertArr = require('../helpers/convertArray');
const path = require('path');
const fs = require('fs');
class BannerController {
    destroy(req, res){
        Banner.findById(req.body.id)
     .then((dataItem) => {
         var filePath = path.join(__dirname + '\\..\\public\\img\\banners\\' + dataItem.thumb ) ;
         fs.unlinkSync(filePath);
         return Banner.findByIdAndRemove(dataItem._id)
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
                  Banner.findById(req.params.id)
                  .then((data) => {
                
                     var filePath = path.join(__dirname + '\\..\\public\\img\\banners\\' + data.thumb ) ;
                     fs.unlinkSync(filePath);
       
       
                     file = req.files.thumb;
                     file.mv(path.join(__dirname, '\\..\\public\\img\\banners\\') + (ramdomName + file.name), function(error){
                        if(error){
                           return res.send(error);
                        }
                    });
                  })
                  .catch((error) => {
                     return res.send(error);
                  })
                
              }
              Banner.findByIdAndUpdate(req.params.id, {
                   name : req.body.name,
                   description : req.body.description,
                   url : req.body.url,
              })
              .then((data) => {
                  if(file){
                   return Banner.findByIdAndUpdate(req.params.id, {
                        thumb : (ramdomName + file.name)
                    })
                    .then((dataItem) => {
                          return res.redirect('/admin/banner/list');
                    })
                    .catch((error) => {
                        return (res.send(error));
                    });
                  }else {
                    return res.redirect('/admin/banner/list');
                  }
              })
              .catch((error) => {
                  return (res.send(error));
              });
        }else {
           Banner.findById(req.params.id)
           .then((data) => {
            req.body._id = data._id;
            req.body.name = data.name;
            req.body.thumb = data.thumb;
            return res.render('templates/banner/edit', {arrError,dataItem : req.body});
           })
           .catch((error) => {
              return res.send(error);
           })
        } 
    }
    show(req, res){
        Banner.findById(req.params.id)
        .then((dataItem) => {
            dataItem = convertArr.mongoseToObject(dataItem);
            return res.render('templates/banner/edit', {dataItem});
        })
        .catch((error) => {
            return res.send(error);
        })
    }
    index(req, res){
        Banner.find({})
        .then((dataItem) => {
            dataItem = convertArr.multipleMongose(dataItem);
            return res.render('templates/banner/list', {dataItem} );
        })
        .catch((error) => {
            return res.send(error);
        })
    }
    create(req, res){
        return  res.render('templates/banner/add' );
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
              file.mv(path.join(__dirname, '\\..\\public\\img\\banners\\') + (ramdomName + file.name), function(error){
                 if(error){
                    res.send(error);
                 }
             })
          }
         return  Banner.create({
              name : req.body.name,
              description : req.body.description,
              url : req.body.url,
              thumb : (ramdomName + file.name)
          })
          .then((data) => {
            return res.render('templates/banner/add', {success : `Thêm banner ${data.name} thành công !`});
          })
          .catch((error) => {
            return (res.send(error));
          })
        }else {
            return res.render('templates/banner/add', { arrError, old_input : req.body});
        }
    }
 }
 module.exports = new BannerController();