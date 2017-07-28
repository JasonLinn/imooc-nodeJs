
const Category = require('../models/Category.js');





// list page
exports.list = (req, res) => {

    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err);
        }
        res.render('categorylist', {
            title: '分類list page',
            categories: categories
        });
    })
};



//admin post movie
exports.save = function (req, res) {
    // console.log("a");  经过判断是下方这个语句出了问题
    var _category = req.body.category;
    

    var category = new Category(_category);
    category.save(function (err, movie) {
        if (err) {
            console.log("我是错误，我在这里");
            console.log(err);
        }
        
        res.redirect('/admin/category/list' );
        console.log("这里是跳转之后");
    });
    
};

// list page
exports.new = (req, res) => {
    res.render('category_admin', {
        title: '電影分類 后台录入页',
        category:{}
        
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