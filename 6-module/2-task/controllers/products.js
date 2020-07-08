const url = require('url');
const mongoose = require('mongoose');
const Product = require('../models/Product');

function getTransformedArray(arr) {
  return arr.map((model) => getDocFromProductModel(model));
}

function getDocFromProductModel(model) {
  let doc = model.toJSON();
  return {
    id: doc._id,
    title: doc.title,
    images: doc.images,
    category: doc.category,
    subcategory: doc.subcategory,
    price: doc.price,
    description: doc.description
  }
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = url.parse(ctx.req.url, true).query.subcategory;
  if (subcategory) {
    let arr = await Product.find({subcategory: subcategory});
    ctx.body = {products: getTransformedArray(arr)};
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  let arr = await Product.find({});
  ctx.body = {products: getTransformedArray(arr)};
};

module.exports.productById = async function productById(ctx, next) {
  if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    let product = await Product.findById(ctx.params.id, 'id title images category subcategory price description');
    if (product) {
      ctx.body = {product: getDocFromProductModel(product)};
    } else {
      ctx.res.statusCode = 404;
      ctx.res.end();
    }
  } else {
    ctx.res.statusCode = 400;
    ctx.res.end();
  }
};

