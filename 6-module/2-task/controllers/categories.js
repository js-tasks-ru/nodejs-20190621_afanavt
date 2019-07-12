const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {

    const find = await Category.find();

    const categories = find.map(cat => ({
        title: cat.title,
        id: cat._id,
        subcategories: cat.subcategories.map(sub => ({
            title: sub.title,
            id: sub._id,
        }))
    }));

    ctx.body = { categories };
};


