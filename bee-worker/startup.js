const path = require('path'),
      util = require('../utils/util'),
      Url = require('url'),
      getSourceUrl = require('../bee-queen/cluster'),
      Promise = require('promise'),
      schedule = require('node-schedule'),
        fs = require('fs');

/**
 * [getTask 获取爬虫源]
 * @param  {[type]} dirName [存放爬虫源的路径]
 * @return {[type]}         [description]
 */
function getTask(dirName) {
    return util.getFileDir(dirName)
    .then(function(data) {
        let pathArr = [];
        data.forEach((item, index)=> {
            if(util.isPathDir(dirName + item)) {
                pathArr.push(item);
            } else {
                throw new Error('bee目录爬虫源目录结构错误,请以爬虫源的域名命名文化夹');
            }
        })
        return this.Promise.resolve(pathArr);
    })
}

/**
 * [cronJod 分发爬虫任务]
 * @param  {[Array]} urlSource [需要爬虫的url列表]
 * @return {[type]}           [description]
 */
function cronJob(beeDirName, urlSource) {

    // 无爬虫列表则返回
    if(urlSource.length == 0 ) {
        console.log('没有可以爬取得源哦 ^_^');
        return
    };
    urlSource.forEach((url, index)=> {
        let isUrl = util.judeUrl(url);
        if (!isUrl) {
            url = `http://${url}`;
        }
        let hostName = Url.parse(url).hostname;
        let dirNamePath = beeDirName + hostName;
        // 获取每个爬虫源目录下的文件
        util.getFileDir(dirNamePath)
        .then(function(urlFiles) {
            let arr = urlFiles.map((item)=> {
                return item.split('.')[0]; 
            })
            if (arr.length != 0) {
                // 排序路由文件_.js在前面
                arr = arr.sort(function(a,b) {
                    return a > b;
                })
                 // 请求_.js路由文件
                let route = require(`${dirNamePath}/${arr[0]}.js`);
                // 根据_.js路由文件返回要引入处理url的module
                let file = util.getRouteFile(url, route);
                // 根据对应的链接爬取
                if (file) {
                    require(`${dirNamePath}/${file}.js`)(url);
                } else {
                    console.log(`没有对应的文件进行分发${url}！！！`);
                    return;
                }
            } else {
                console.log('bee目录下没有对应的模块处理${url}!!!');
            }
        })
    })
}

// 存储爬虫url列表
function saveLists() {
    let beeDirName = `${__dirname}/bee/`;
    getTask(beeDirName)
    .then(function(urlSource) {
        cronJob(beeDirName, urlSource);
    })
}

// 获取爬虫url列表数据
function saveData() {
    let beeDirName = `${__dirname}/bee/`;
    getTask(beeDirName)
    .then(function(urlSource) {
        urlSource.forEach((url, index)=> {
            if(!/[a-zA-Z]+:\/\/[\w\W]*/.test(url)) {
                url = `http://${url}`;
            }
            getSourceUrl(url)
            .then(function(sourceUrl){
                cronJob(beeDirName, sourceUrl);
            })
            .catch(function(err) {
                console.error(err);
            })
        })
    })
}

function init() {
    var rule = new schedule.RecurrenceRule();
　　var times = [];
　　for(var i=20; i<60; i +=20){
　　　　times.push(i);
　　}
　　rule.minute = times;
　　var j = schedule.scheduleJob(rule, function(){
     　　saveLists();
        setTimeout(saveData,1000);
　　});  
}
init();
