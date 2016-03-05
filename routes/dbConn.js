/**
 * Created by LG on 2016-02-19.
 */
var mypoolsql = require('my_pool_sql');
module.exports.pool=new mypoolsql(100,{
   host:'127.0.0.1',
    user:'root',
    password:'gosl123',
    db:'test',
    log:true
});