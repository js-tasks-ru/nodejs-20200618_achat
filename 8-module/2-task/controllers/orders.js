const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {

  const order = await Order.create({
    user: ctx.user,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  await sendMail({
    template: 'order-confirmation',
    locals: {id: order._id, product: order.product},
    to: ctx.user.email,
    subject: 'Подтвердите почту',
  });

  ctx.body = {order: order._id};

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const asyncFunctions = [], arr = [];

  let orders = await Order.find({user: ctx.user._id});
  orders.forEach((order) => {
    asyncFunctions.push(order.populate('user').populate('product').execPopulate());
  });

  const results = await Promise.all(asyncFunctions);
  results.forEach((order) => {
    arr.push({
      id: order._id,
      user: order.user._id,
      product: {
        id: order.product._id,
        title: order.product.title,
        images: order.product.images,
        category: order.product.category._id,
        subcategory: order.product.subcategory._id,
        price: order.product.price,
        description: order.product.description,
      },
      phone: order.user.phone,
      address: order.user.address
    });
  });

  ctx.body = {orders: arr};
};
