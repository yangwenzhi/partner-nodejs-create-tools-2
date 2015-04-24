var fs = require('fs');

function cretatJS(json){
    var pathfile  = __dirname.replace(/\\/g,'/').replace('util','');
    var partner_h = pathfile+'config/partner_h.txt';
    var partner_f = pathfile+'config/partner_f.txt';
    var url       = pathfile+'public/checkout/partner.js';

    var js = '';
    fs.readFile(partner_h, {encoding:'utf8'}, function(err, data){
        js += data+';\n';
        js += 'var json='+json+';\n';
        fs.readFile(partner_f, {encoding:'utf8'}, function(err, data){
            js += data+';\n';
            fs.writeFile(url, js, {encoding:'utf8'}, function(err){
                console.log('success create partner.js');
            });
        });            
    });
}

module.exports.createjs = cretatJS;
