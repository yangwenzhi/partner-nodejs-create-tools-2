var fs = require('fs');
var urllib = require('url');
var BaseData = require('../lib/basedata')();
var createCode = require('../util/createjs');
var login = require('../util/login');
var user   = require('../config/login');
var exec = require('child_process').exec;

var apis = function(app){

    app.get('/', function(req, res){
        res.redirect('/login');       
    });

    app.get('/login', function(req, res){
        if(login.islogin(req, res)){
            res.redirect('/tables');
        }
        else{
            res.render('login');
        }
    });

    app.post('/login/check', function(req, res){
        if(req.body.username == user.username && req.body.password == user.password) {
            res.send(200, {status:1});
        }
        else {
            res.send(200, {status:0});
        }
    });

    app.get('/tables', function(req, res){
        if(login.islogin(req, res)){
            BaseData.select({}, function(data) {
                res.render('tables', { data: data });
            });
        }
        else{
            res.render('login');
        }
    });

    //读取测试文件
    app.get('/checkout', function(req, res){
        res.render('checkout');
    });

    //修改测试json数据
    app.post('/api/data/checkout/', function(req, res){
        var json = JSON.stringify(req.body);
        var url  = __dirname.replace(/\\/g,'/').replace('routes','')+'config/checkout.json';
        fs.writeFile(url, json, {encoding:'utf8'}, function(err){
            createCode.createjs(json);
            res.send(200, {status:1, data: json});
        });
    });

    //删除数据接口
    app.get('/api/data/delete/:id', function(req, res){
        var id = req.params.id;
        BaseData.delete({'id': id}, function(data) {
            res.redirect('/tables');
        });
    });

    //添加数据接口
    app.post('/api/data/add/', function(req, res){
        var click_id = (req.body.link.indexOf('?') == -1) ? 0 : req.body.link.split('?')[1].split('=')[1];
        var opt = {
            'title': req.body.title,
            'link': req.body.link,
            'url': req.body.url,
            'notshow': '0',
            'updatatime': new Date(),
            'username': 'elex',
            'click_id': click_id
        };
        BaseData.add(opt, function(data) {
            res.send(200, {status:1, data: JSON.stringify(data)});
        });
    });

    //编辑数据接口
    app.post('/api/data/edit/', function(req, res){
        var click_id = (req.body.link.indexOf('?') == -1) ? 0 : req.body.link.split('?')[1].split('=')[1];
        var opt = {
            'id': req.body.id,
            'title': req.body.title,
            'link': req.body.link,
            'url': req.body.url,
            'click_id': click_id
        };
        BaseData.updata(opt, function(data) {
            res.send(200, {status:1, data: JSON.stringify(data)});
        });
    });

    //partner数据接口
    app.get('/api/data/partnerlist/:ids', function(req, res){
        var opt = {
            'ids': req.params.ids.split(',')
        };
        BaseData.partner(opt, function(data) {
            var params = urllib.parse(req.url, true);
            if (params.query && params.query.jsoncallback) {
                var str =  params.query.jsoncallback + '(' + JSON.stringify(data) + ')'; //jsonp
                res.end(str);
            }
            else {
                res.end(JSON.stringify(data)); //普通的json
            }
        });
    });

    //上传文件到v9线上服务器
    app.get('/api/data/uploadfile/:partner', function(req, res){
        //本地copy
        var partner = req.params.partner;
        var childProcess = exec('cp -f /home/elex/ywz/partner/public/checkout/partner.js /home/elex/ywz/partner/build/'+partner+'.js', function(error, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            else {
                res.send(200, {status:1, message: 'Code Success'});
            }
        });
    });

};

module.exports.confApi = apis;
