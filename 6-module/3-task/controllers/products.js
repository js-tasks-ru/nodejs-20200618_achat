const url = require('url');
const Product = require('../models/Product');

function getTransformedArray(arr) {
  return arr.map((model) => getDocFromProductModel(model));
}

function getDocFromProductModel(model) {
  let doc = model.toJSON();
  return {id: doc._id, ...doc};
}

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = url.parse(ctx.req.url, true).query.query;
  let arr = await Product
  .find(
    {$text: {$search: query}},
    {score: {$meta: "textScore"}}
  )
  .sort({score: {$meta: 'textScore'}});
  ctx.body = {products: getTransformedArray(arr)};
};
