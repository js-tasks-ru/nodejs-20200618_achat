const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const arrMessages = await Message.find({chat: ctx.user._id}, null, {limit: 20});
  ctx.body = {messages: arrMessages.map(msg => ({
      date: msg.date,
      text: msg.text,
      id: msg._id,
      user: msg.user
  }))};
};
