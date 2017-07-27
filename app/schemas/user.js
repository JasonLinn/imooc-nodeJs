var mongoose = require('mongoose');
var bcrypt =require('bcrypt');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:String,
    // user
    // admin
    // super admin
    role:Number,
    //0:nomal  user 
	//1:verified  user 
	//2:professonal user

	//>10 : admin
	//>50 : super admin
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }

    }
});

//新增一個 pre 的实例方法  
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    //generate salt
    //第一個參數是計算強度
    bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt){
        if(err) return next(err);
        //salt 是上面生成的鹽
        bcrypt.hash(user.password,salt,function (err,hash){
            if(err) return next(err);

            user.password = hash;
            next();
        })
    })
})

UserSchema.methods = {
    comparePassword: function (_password,cb){
        //compare 比對密碼  _password是傳入的密碼 this.password是DB的密碼
        bcrypt.compare(_password,this.password,function (err,isMatch){
            if(err) return cb(err);

            cb(null,isMatch);
        })
    }
}

//新增一個 靜態方法 在Model層就可以用
UserSchema.statics = {
    // 用fetch方法获取所有的数据
    fetch: function (callback) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(callback);
        // 根据更新的时间排序
    },
    findById: function (id, callback) {
        return this
            .findOne({ _id: id })
            .exec(callback);
    }
};
module.exports = UserSchema;
