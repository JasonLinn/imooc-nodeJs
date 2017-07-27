const Movie = require('../models/movie.js');
// index page
exports.index = function (req,res){

    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'index page',
            movies: movies
        });
    })
    
}
