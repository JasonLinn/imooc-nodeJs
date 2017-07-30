const Movie = require('../models/movie.js');
const Category = require('../models/category');
// index page
exports.index = function (req,res){

    Category
        .find({})
        .populate({path:'movies',option:{limit:5}})
        .exec(function (err,categories){
            console.log(categories,'categories');
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: 'index page',
                categories: categories
            });  
        })


    
}
// search page
exports.search = function (req,res){
    var catId = req.query.cat;
    var page = req.query.p;
    var index = page * 2;
    Category
        .find({_id:catId})
        .populate({path:'movies',option:{limit:2,skip:"index"}})
        .exec(function (err,categories){
            console.log(categories,'categories');
            if (err) {
                console.log(err);
            }
            var category = categories[0] || {};
            res.render('results', {
                title: '結果列表頁面',
                keyword:category.name,
                categories: categories[0]
            });  
        })


    
}
