const User = require('../models/user');

exports.showSignup = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('signup', {
            title: '註冊頁面',
            users: users
        })
    })
}

exports.showSignin = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('signin', {
            title: '登入頁面',
            users: users
        })
    })
}

exports.signup = function (req,res){
    //post 用 body
    var _user = req.body.user;
    // var user = new User(_user);
    User.findOne({ name: _user.name }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            console.log('yeah');
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            })
        }
    })

    //req.param('user') /:id 不管用什麼方式都可以用
    //req.query  ?userId=id
    //先路由在body最後query
}
exports.signin = function (req,res){
    var _user = req.body.user;  //取得post的user資料
    var name = _user.name //取得name
    var password = _user.password //取得psw
    User.findOne({ name: name }, function (err, user) {  //在資料庫中找name是否存在，找到的話return 一個user
        if (err) {
            console.log(err)
        }
        if (!user) {  //如果沒有這個user，會console，加跳轉到註冊頁
            console.log('请先注册再登录')
            return res.redirect('/signup')
        }

        user.comparePassword(password, function (err, isMatch) {  //在schema的方法在這邊被調用，用來加密
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                console.log('password is matched')
                req.session.user = user

                return res.redirect('/')
            } else {
                console.log('密码错误，请重新输入')
                return res.redirect('/signin')

            }
        })
    })
}

exports.logout = function (req,res){
    delete req.session.user;
    res.redirect('/');    
}

exports.list = function (req,res){
    var user = req.session.user;
    if(!user){
        return res.redirect('/');
    }
    if(user.role >10){

        User.fetch(function (err, users) {
            if (err) {
                console.log(err);
            }
            res.render('userlist', {
                title: 'imooc 用戶列表頁',
                users: users
            })
        })    
    }
}

//midware for user
exports.signinRequired = function (req, res,next) {
    var user = req.session.user;

    if(!user){
        return res.redirect('/signin');
    }
    
    next();
}

exports.adminRequired = function (req, res, next) {
    var user = req.session.user;
    console.log(user);
    if (!user.role || user.role <= 10){
        return res.redirect('/signin');
    }
    next();
}