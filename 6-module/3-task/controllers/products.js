const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
    try {
        const products = await Product.find({ $text: { $search: ctx.query.query  }  });

        if (products.length === 0) {
            ctx.body = { products: [] };
        }

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
}

