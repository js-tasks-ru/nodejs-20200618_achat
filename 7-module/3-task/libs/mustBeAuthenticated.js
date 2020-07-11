module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    let err = new Error('Пользователь не залогинен');
    err.status = 401;
    throw err;
  }
  return next();
};
