var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new mongoose.Schema({
    name:String,
    movies:[{type:ObjectId,ref:'Movie'}],
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
CategorySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
})

//新增一個 靜態方法 在Model層就可以用
CategorySchema.statics = {
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
module.exports = CategorySchema;
