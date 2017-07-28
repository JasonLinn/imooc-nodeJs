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
