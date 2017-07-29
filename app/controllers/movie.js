
const Movie = require('../models/movie.js');
var Category = require('../models/category');
const _ = require('underscore');
const Comment = require('../models/comment');


// detail page
exports.detail = function (req, res) {
    var id = req.params.id;
    console.log("这个/movie/:id的网页中的id是:" + id); // 424这个地方是可以打印出东西来的
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log("在这里出现了错误");
                return;
            }
            console.log(movie.title, 'title');
            console.log(id,'id');
            console.log(movie, 'movie');

            Comment
                .find({movie:id})
                .populate('from','name') //關聯搜尋 把name返回
                .populate('reply.from reply.to','name')
                .exec(function (err,comments){
                console.log(comments,'comments');
                res.render('detail', {
                    title: "oh" + movie.title,
                    movie: movie,
                    comments:comments
                });
            })
            
            //这里的意思其实给detail这个html文件传值
            console.log("这里已经走完了一次if");
        });
    }
};




// list page
exports.list = (req, res) => {

    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'list page',
            movies: movies
        });
    })
};

//admin update movie
exports.update = function (req, res) {
    var id = req.params.id

    if (id) {
        Movie.findById(id, function (err, movie) {
            Category.find({}, function (err, categories) {
                res.render('admin', {
                    title: '后台更新页',
                    movie: movie,
                    categories: categories
                })
            })
        })
    }
}
//admin post movie
exports.save =  function (req, res) {
    // console.log("a");  经过判断是下方这个语句出了问题
    var id = req.body.movie._id;
    console.log("在post这个过程中id是:" + id); //undefined
    var movieObj = req.body.movie;
    console.log("movieObj is:"+movieObj);
    console.log('id:',id);
    var _movie;
    // console.log(id==='undefined');//false
    // console.log(id=='undefined'); //false
    // console.log(id==="underfined"); //false
    // console.log(id);                  //undefined
    // console.log(typeof id);
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }

            _movie = _.extend(movie, movieObj) //underscore
            console.log(_movie);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id) //重定向
            })
        })
    } else {
        _movie = new Movie(movieObj);
        var categoryId = _movie.category;
        var categoryName = movieObj.categoryName;
        _movie.save(function (err, movie) {
            if (err) {
                console.log("我是错误，我在这里");
                console.log(err);
            }
            console.log("跳转之前电影的id是：" + movie._id);
            console.log(`movieObj ${movieObj}`)
            if(categoryId){  //如果有categoryId
                Category.findById(categoryId,function (err,category){
                    category.movies.push(_movie._id);
                    category.save(function (err,category){
                        res.redirect('/movie/'+movie._id)
                    })
                })
                
            }else if(categoryName){
                var category = new Category({
                    name:categoryName,
                    movies:[movie._id]
                })

                category.save(function (err,category) {
                    movie.category = category._id;
                    movie.save(function (err,movie) {  //除了category要存，
                        
                        res.redirect('/movie/' + movie._id);
                    })
                })
            }
            // res.redirect('/movie/' + movie._id);
            // console.log("这里是跳转之后");
        });
    }
};

// list page
exports.new = (req, res) => {
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
};


//list delete movie
exports.del = function (req, res) {
    var id = req.query.id;
    console.log(id);
    if (id) {
        Movie.remove({ _id: id }, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        })
    }
}

//admin new category
exports.new = function (req,res){
    Category.find({},function (err,categories){
        res.render('admin',{
            title:'imooc 後檯燈入夜',
            categories:categories,
            movie:{}
        })
    })
}