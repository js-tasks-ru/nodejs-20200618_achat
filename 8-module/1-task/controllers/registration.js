const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  ctx.set('Content-Type', 'application/json');
  const token = uuid();

  const content = ctx.request.body;
  const user = new User(content);
  await user.setPassword(content.password);
  user.verificationToken = token;

  try {
    await user.save();

    await sendMail({
      template: 'confirmation',
      locals: {token},
      to: user.email,
      subject: 'Подтвердите почту',
    });

    ctx.status = 200;
    ctx.body = {status: 'ok'}
  } catch (e) {
    ctx.status = 400;
    let errors = {};
    for (let err in e.errors) {
      errors[err] = e.errors[err].message;
    }
    ctx.body = {errors: errors};
  }
};

module.exports.confirm = async (ctx, next) => {
  ctx.set('Content-Type', 'application/json');
  const content = ctx.request.body;

  const user = await User.findOne({verificationToken: content.verificationToken});
  if (user) {
    user.verificationToken = undefined;
    await user.save();

    // const token = uuid();
    ctx.status = 200;
    ctx.body = {token: uuid()};
  } else {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }
};
