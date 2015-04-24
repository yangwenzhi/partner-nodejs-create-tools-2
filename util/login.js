var cookie = require('../lib/cookie');
var user   = require('../config/login');

function isLogin(req, res){

    var cookieHandle = cookie.getHandler(req, res);
    if(user.username == cookieHandle.get('user')){
        return true;
    }
    else{
        return false;
    }
}

module.exports.islogin = isLogin;
