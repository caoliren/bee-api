# bee-api
## 爬虫小系统，用来收集信息

* bee-drone
雄蜂负责对采集到的蜂蜜（honey）进行统一处理（过滤一些不需要的垃圾数据）
* bee-queen
蜂王负责分发（flower）爬取任务:
-- 工蜂获取到的蜂蜜（honey）由蜂王分发给雄蜂进行内容信息统一处理
-- 工蜂获取到的花丛地址（cluster）由蜂王继续分发给工蜂进行蜂蜜（honey）采集
* bee-worker
工蜂负责对蜂王分发的采集任务飞到目的地进行蜂蜜采集，采集到蜂蜜后工蜂可以顺带将发现的花丛地址（cluster）带回以便蜂王再次分发任务

**安装依赖包**
```
npm install // 如果已经安装淘宝镜像运行 cnpm install
```
**启动**
```
node startup.js
```
**项目支持安装pm2并启动项目**
```
npm install -g pm2
```
```
pm2 start pm2.json
```

**使用命令行爬取对应的url**
如爬取*http://daily.zhihu.com/story/9300775*
```
node startup.js -u http://daily.zhihu.com/story/9300775
```
**查看命令行其他操作**
```
node startup.js -h
```
### Api调用
**获取前20条数据**
```
https://api.leancloud.cn/1.1/cloudQuery?cql=select * from honey limit 0,20 order by pubUser
```
以下字段添加到header请求头文件中
```
X-LC-Id: 7cJ55lgvs2dtGXVFNer8FBC7-gzGzoHsz
X-LC-Key: iuSaVf4EWIfibgzxt2iG45QL

```
### 数据结构
**cluster列表的数据结构**
```
{   
    listsUrl: [] // 列表
    ,originalUrl: '' // 爬取列表的爬虫源
    ,isRelate: true // 是否是相关链接
    ,page: 1 // 分页处理
}
```
**honey内容的数据结构**

```
{
    title: '' // 内容标题
    ,subhead: '' // 内容副标题
    ,summary: '' // 内容摘要
    ,author: '' // 内容作者
    ,image: '' // 内容门面图
    ,content: '' // 内容
    ,date: '' // 内容日期
    ,originalUrl: '' // 内容源链接
    ,tag: [], //内容类型
    ,comments: [{
        author: '' // 评论人名字
        ,authorInfo: '' // 评论人介绍
        ,authorImg: '' // 评论人头像
        ,date: '' // 评论时间
        ,content: '' // 评论内容
    }] // 文章评论
} 
```
**flower数据结构**

```
{   
    ,cluster: {}
    ,honey: {} 
    ,extend: {}// 额外补充
}
```
### 重构
* MVC分层(完成)
* 异步方案由Promise变成co（完成）
* 添加pm2进程管理 （完成）
* 添加日志（完成）
* 去重 （完成）
* 定时爬取 （完成）
* 爬取失败需要重爬3次 (完成)
* 配置命令行参数处理对应的逻辑(目前只支持爬取对应的url)

### 优化
**TODO:**
* 直接根据目录名来获取爬虫源而无需读取config文件的源，方便config配置文件遗漏配置某个源
