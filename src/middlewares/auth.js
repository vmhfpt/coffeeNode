const  jwt = require('jsonwebtoken');
function auth(req, res, next){
    const cookieToken = req.cookies.token;
  try{
    var decoded = jwt.verify(cookieToken, 'authentication');
    next();
  }catch{
    return res.render('templates/authen/login', { old_input : req.body.email,'status': 'Vui lòng đăng nhập lại !' ,layout: false});
  }
     // next();
}

module.exports = auth;