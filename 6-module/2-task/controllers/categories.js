const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  let arr = await Category.find({});
  let docs = arr.map((model) => {
    let doc = model.toJSON();
    let subDocs = doc.subcategories.map((sub) => {
      return {
        id: sub._id,
        title: sub.title
      }
    });
      return {
      id: doc._id,
      title: doc.title,
      subcategories: subDocs
  }});

  ctx.body = {categories: docs};
};
