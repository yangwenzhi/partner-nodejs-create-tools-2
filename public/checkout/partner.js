(function () {;
var json={"itemData":"3,2,1","type":"2","width":"660","height":"178","number":"3","partner":"v3","author":"dazhi"};
    var itemData = json.itemData;
    var adParams = {
        num:json.number,
        width:json.width,
        height:json.height
    };

    var loadJS = function(url, success) {
        var domScript = document.createElement('script');
        domScript.src = url;
        success = success || function(){};
        domScript.onload = domScript.onreadystatechange = function() {
            if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                success();
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
            }
        }
        document.getElementsByTagName('head')[0].appendChild(domScript);
    }

    var htmlUI = function(){
        var hotWrap = document.getElementById("elexHotZone");
        hotWrap.innerHTML = '<ul id="elexHotUl" style="overflow: hidden;width:660px;height:178px;margin:auto;padding:0;border:1px dashed #ccc;"></ul>';
        var htmlArray = "";
        var divNum = adParams.num ? adParams.num : itemData.length;
        if(adParams.num>itemData.length){
            divNum = itemData.length;
        }
        if(json.type == "2"){
            for (var i = 0; i < divNum; i++) {
                var dispalyName = itemData[i].title;
                dispalyName = dispalyName.split(" ")[0];
                htmlArray += '<li style="float: left;width: 60px;height: 50px;display: inline;text-align: center;margin: 8px 0 0 0;padding: 0px 0;background: #fff;"><a target="_blank" style="display: block;height: 50px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #333;font-family: Arial, Helvetica, sans-serif;font-size: 10px;letter-spacing:-0.1em;text-decoration: none;" title="' + itemData[i].title +
                    '" href="' + itemData[i].link + '&partner=' + json.partner +
                    '"><i style="display: block;width: 32px;height: 32px;margin: 0 auto;overflow: hidden;' + 'background: url(' +
                    itemData[i].url +
                    ') no-repeat 0 0;background-size:32px 32px;"></i>' +
                    dispalyName + '</a>';
            }
        }else{
            for(var i=0;i<divNum;i++){
                htmlArray += '<li style="float: left;width: 94px;height: 64px;display: inline;text-align: center;margin: 8px 0 0 0;padding: 8px 0;background: #fff;"><a  target="_blank" style="display: block;height: 64px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #333;font-family: Arial, Helvetica, sans-serif;font-size: 12px;text-decoration: none;" title="' + itemData[i].title +
                    '" href="'+ itemData[i].link + '&partner=' + json.partner +
                    '"><i style="display: block;width: 48px;height: 48px;margin: 0 auto;overflow: hidden;'+'background: url('+ itemData[i].url+') no-repeat 0 0;background-size:48px 48px;"></i>'+itemData[i].title+'</a>';
            }
        }
        var elexHotUlDom = document.getElementById("elexHotUl");
        elexHotUlDom.innerHTML = htmlArray;
        if (adParams.width) {
            elexHotUlDom.style.width = adParams.width + "px";
        }
        if (adParams.height) {
            elexHotUlDom.style.height = adParams.height + "px";
        }
        new Image().src = "http://pub.v9.com/partner/stat/s.png?partner="+json.partner+"&t=" + Math.floor(Math.random() * (new Date()).valueOf());
    }

    loadJS('http://zeptojs.com/zepto.min.js',function (){
        $.ajax({
            type:"get",
            dataType: "jsonp",
            url:"http://10.1.20.222:6001/api/data/partnerlist/"+itemData,
            jsonp:"jsoncallback",
            success:function(data){
                itemData = data;
                htmlUI();
            }
        });



    });
})();;
