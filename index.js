const express = require('express');
// const static = require('express-static');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');
var session = require('express-session');  //要先引入session給下面的mongoStore用
var mongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
//HTTP request logger middleware for node.js
var morgan = require('morgan'); //node.js 日誌中間件
// app.user


const dbUrl = 'mongodb://localhost/imooc';
let port = process.env.PORT || 3000;
let app = express();

//要加這行不然會抱錯, { useMongoClient: true }
mongoose.connect(dbUrl, { useMongoClient: true })

//把mongoogse.Promise改成全域
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connect error !'))
db.once('open', function () {

  console.log('Mongodb started !')

})
app.locals.moment = require('moment'); // 载入moment模块，格式化日期
app.set('views', './app/views/pages');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true})); //bodyParser 用來編譯模板中的變數
// app.use(cookieParser()); //要加這個啟用session
app.use(session({
  secret:'imooc',
  store:new mongoStore({ //保持用戶狀態
    url:dbUrl,
    collection:'sessions'
  }),
  resave: false,
  saveUninitialized: true
}))

if('development' === app.get('env')){ //判斷目前環境
  console.log('enviroment:',app.get('env'));
  app.set('showStaticError',true);
  app.use(morgan(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug',true);
}

require('./config/route')(app); //引用config的route
// var serveStatic = require('serve-static');  // 静态文件处理
// app.use(serveStatic('bower_components')); // 路径：public
// app.use(static(path.join(__dirname, 'bower_components/')))
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

console.log(`server running at localhost: ${port}`);

