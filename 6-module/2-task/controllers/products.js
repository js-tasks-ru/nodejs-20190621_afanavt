const mongoose = require('mongoose');
const Product = require('../models/Product');
const NotFoundError = require('../errors/NotFoundError');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
    try {
        const products = await Product.find({subcategory: ctx.query.subcategory});

        ctx.body = {
            products: products.map(({
                title, _id: id, category, subcategory, price, description, images
            }) => ({
                title, id, category, subcategory, price, description, images
            }))
        };
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            ctx.body = {products: []};
        }
    }
};

module.exports.productList = async function productList(ctx, next) {
    ctx.body = { products: [] };
};

module.exports.productById = async function productById(ctx, next) {
    try {
        const product = await Product.findById(ctx.params.id);
        if (!product) {
            throw new NotFoundError('not found');
        }

        ctx.body = { product: {...product, id: product._id} };
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            ctx.throw(400, err.message);
        } else if (err instanceof NotFoundError) {
            ctx.throw(404, err.message);
        }

        ctx.throw(500, 'server error');
    }
};

