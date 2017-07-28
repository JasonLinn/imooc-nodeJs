const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/Movie');
const comment = require('../app/controllers/comment');
const Category = require('../app/controllers/Category');



module.exports = function(app){
    
    //pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        console.log('user session is:', req.session.user);
        res.locals.user = _user; //如果_user = undefine 則會判斷false
        next();
    })


    // Index
    app.get('/', Index.index);

    // User
    app.post('/user/signup', User.signup)
    app.post('/admin/signin', User.signin)
    app.get('/signin', User.showSignin)
    app.get('/signup', User.showSignup)
    app.get('/logout', User.logout)
    app.get('/admin/user/list',User.signinRequired,User.adminRequired, User.list)


    // Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired,Movie.list);
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired,Movie.del);

    // Comment
    app.post('/admin/comment', User.signinRequired, comment.save);

    //Category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
};