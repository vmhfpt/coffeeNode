const User = require('../models/User');
const  jwt = require('jsonwebtoken');
class UserController {
     logOut(req, res){
          res.clearCookie('token');
          const token =  jwt.sign({
               data: null
          }, 'authentication', { expiresIn: '10s' });
          res.render('templates/authen/login', {layout: false});
     }
     create(req, res){
          res.render('templates/user/add');
     }
    
     auth(req, res){
          User.findOne({email : req.body.email, password : req.body.password })
        .then((data) => {
            if(data){
               const {_id, email, } = data;
              const token =  jwt.sign({
                    data: {_id, email, }
               }, 'authentication', { expiresIn: '1h' });
               res.cookie('token', token, { expires: new Date(Date.now() + 90000000000) });
               res.redirect('/admin/');
            }else {
               res.render('templates/authen/login', { old_input : req.body.email,'status': 'Email hoặc mật khẩu không chính xác !' ,layout: false});
            }
        })
        .catch((error) => {
            res.json({'status': 'error'});
        })
     }
     
}
module.exports = new UserController();
