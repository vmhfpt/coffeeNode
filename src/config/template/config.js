const Category = require('../../models/Category');
const convertArr = require('../../helpers/convertArray');
const path = require('path');
const   { engine }  =  require('express-handlebars');
const { isNull } = require('util');
function config(app){
  
   app.engine('handlebars', engine());
   app.set('view engine', 'handlebars'); 


    app.all('/*',  async  function(req, res, next){
        app.set('views', path.join(__dirname, '/../../resources/views/layouts/post/'));
        app.engine('handlebars', engine({
          defaultLayout: 'main',
          layoutsDir:  __dirname + '/../../resources/views/layouts/post/',
          helpers : {
            autoIndex : function (index){
                return (index + 1);
            },
            parentShow : function(object) {
                if(object){
                   return(object.name);
                }
            },
            checkActive : function (var1, var2) {
              
                if(String(var1) == String(var2)){
                  return ('active');
                }
            },
            /*
            pagination = {
                currentPage: req.query.page,
                sumPage: Math.round(total.length / limit),
                total : total.length
              };
            */
            pagination : function (object){
              var text = '';
                 for(var i = 1; i <= object.sumPage; i++){
                    if(object.currentPage == i){
                        text = text + `<li class="active"><a href="?page=${i}#top">${i}</a></li>`;
                    }else {
                      text = text + `<li ><a href="?page=${i}#top">${i}</a></li>`;
                    }
                 }
                 return (text);
            }
          },
        }));
        await Category.find({parent_id : null}).then((data) => {
          data =  convertArr.multipleMongose(data);
          app.locals.dataHeader  = data;
          app.locals.slug  = req.params.slug ;
         })
         .catch((error) => {
      
         }); 
      
        next();
      });


      app.all('/admin*', function(req, res, next){
   
        app.set('views', path.join(__dirname, '/../../resources/views/layouts/admin/'));
        app.engine('handlebars', engine({
          defaultLayout: 'main',
          layoutsDir:  __dirname + '/../../resources/views/layouts/admin/',
          helpers : {
            ifCustom : function(variable1, variable2) {
               return (String(variable2) == String(variable1) ? 'selected' : false);
            },
            ifCustom2: function(variable1, variable2) {
               if(String(variable1) == String(variable2)){
                return ('true');
               }else {
                return ('false');
               }
           },
            parentShow : function(object) {
             if(object){
                return(object.name);
             }else {
              return ('Danh mục cha');
             }
           },
           autoIndex : function (index){
             return (index + 1);
           },
           active : function (key){
             if (key == 1){
                return ('Kinh Doanh');
             }
             if(key == 2){
                return ("Tạm Hết Hàng");
             }
             if(key == 3){ 
                return ("Ngừng Kinh Doanh");
             }
           }
      
          }
        }));
        next();
      });
}
module.exports = config;