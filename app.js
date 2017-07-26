const express = require('express');
// const static = require('express-static');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');
const _ = require('underscore');
const Movie = require('./models/movie.js');

let port = process.env.PORT || 3000;
let app = express();

//要加這行不然會抱錯, { useMongoClient: true }
mongoose.connect('mongodb://localhost/imooc', { useMongoClient: true })

//把mongoogse.Promise改成全域
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connect error !'))
db.once('open', function () {

  console.log('Mongodb started !')

})
app.locals.moment = require('moment'); // 载入moment模块，格式化日期
app.set('views', './views/pages');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
// var serveStatic = require('serve-static');  // 静态文件处理
// app.use(serveStatic('bower_components')); // 路径：public
// app.use(static(path.join(__dirname, 'bower_components/')))
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

console.log(`server running at localhost: ${port}`);

// index page
app.get('/', (req, res) => {
  Movie.fetch(function (err,movies){
    if(err){
      console.log(err);
    }
    res.render('index', {
      title: 'index page',
      movies: movies
    });
  })
});

// detail page
app.get('/movie/:id', function (req, res) {
  var id = req.params.id;
  console.log("这个/movie/:id的网页中的id是:" + id); // 424这个地方是可以打印出东西来的
  if (id) {
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log("在这里出现了错误");
        return;
      }
      console.log(movie.title,'title');
      console.log(movie,'movie');
      res.render('detail', {
        title: "oh" + movie.title,
        movie: movie
      });
      //这里的意思其实给detail这个html文件传值
      console.log("这里已经走完了一次if");
    });
  }
});


// list page
app.get('/admin/list', (req, res) => {
  
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: 'list page',
      movies: movies
    });
  })
});

//admin update movie
app.get('/admin/update/:id',function(req,res){
  var id = req.params.id;
  if(id){
    Movie.findById(id,function (err,movie) {
      res.render('admin',{
        title:'imooc 後臺更新頁',
        movie:movie
      })
    })
  }
})

//admin post movie
app.post('/admin/movie/new', function(req, res) {
	// console.log("a");  经过判断是下方这个语句出了问题
	var id = req.body.movie._id;
	console.log("在post这个过程中id是:" + id); //undefined
	var movieObj = req.body.movie;
	// console.log("movieObj is:"+movieObj);
	var _movie;
	// console.log(id==='undefined');//false
	// console.log(id=='undefined'); //false
	// console.log(id==="underfined"); //false
	// console.log(id);                  //undefined
	// console.log(typeof id);
	if (typeof(id) !== 'undefined') {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			});
		});
	} else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		_movie.save(function(err, movie) {
			if (err) {
				console.log("我是错误，我在这里");
				console.log(err);
			}
			console.log("跳转之前电影的id是：" + movie._id);
			res.redirect('/movie/' + movie._id);
			console.log("这里是跳转之后");
		});
	}
});

// list page
app.get('/admin/movie', (req, res) => {
  res.render('admin', {
    title: 'admin page 后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  });
});


//list delete movie
app.delete('/admin/list',function(req,res){
  var id = req.query.id;
  console.log(id);
  if(id){
    Movie.remove({_id:id},function (err,movie){
      if(err){
        console.log(err);
      }else{
        res.json({success:1});
      }
    })
  }
})