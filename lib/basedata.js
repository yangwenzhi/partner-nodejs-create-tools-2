var mysql = require('mysql'),
    pool = require('./pool'),
    extend = require('../util').extend,
    EventEmitter = require('events').EventEmitter;

var basedata = (function(){

    function BaseData() {
        if (!(this instanceof BaseData))
            return new BaseData();
        EventEmitter.prototype.constructor.apply(this, arguments);
    };

    extend(BaseData, EventEmitter);

    BaseData.prototype.response = function(err, conn) {
        var self = this;
        if (err) {
            return function(sql, fn){
                console.log(err);
                conn && conn.release();
                self.emit('error', err);
                return;
            }
        } else {
            return function(sql, data, fn) {
                conn.query(sql, data, function(err, result) {
                    if (err) {
                        console.log(err);
                        conn && conn.release();
                        self.emit('error', err);
                        return;
                    }
                    conn && conn.release();
                    if (fn) {
                        fn(result);
                    } else {
                        self.emit('done', result);
                    }
                });
            };
        }
        return this;
    };

    BaseData.prototype.query = function(sql, data, fn) {
        var self = this;
        pool.getConnection(function(err, conn){
            self.response(err, conn)(sql, data, fn);
        });
        return this;
    };

    /**
     * @: 查询数据
     */
    BaseData.prototype.select = function (options, fn) {
        var sql = 'SELECT id, title, link, url FROM `partner` where notshow<>1 order by id desc limit 50';
        this.query(sql, [], fn);
    };

    /**
     * @: 删除数据
     */
    BaseData.prototype.delete = function (options, fn) {
        var sql = 'UPDATE `partner` SET notshow = 1 WHERE id=' + options.id;
        this.query(sql, [], fn);
    };

    /**
     * @: 添加数据
     */
    BaseData.prototype.add = function (options, fn) {
        var sql = "insert into partner(title, link, url, notshow, updatatime, username, click_id) values('"+options.title+"','"+options.link+"','"+options.url+"','"+options.notshow+"','"+options.updatatime+"','"+options.username+"','"+options.click_id+"')";
        this.query(sql, [], fn);
    };

    /**
     * @: 更新数据
     */
    BaseData.prototype.updata = function (options, fn) {        
        var sql = "UPDATE `partner` SET title='"+options.title+"', link='"+options.link+"', url='"+options.url+"', click_id='"+options.click_id+"' WHERE id="+options.id;
        this.query(sql, [], fn);
    };

    /**
     * @: 查询partner数据
     */
    BaseData.prototype.partner = function (options, fn) {
        var sql = 'SELECT id, title, link, url FROM `partner` where notshow<>1 and id in('+options.ids+') ORDER BY FIELD(id,'+options.ids+')';
        this.query(sql, [], fn);
    };
    

    return BaseData;

})();

module.exports = basedata;
