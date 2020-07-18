module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test')
      ? 'mongodb://localhost/9-module-1-task'
      : 'mongodb://localhost/any-shop',
  },
  crypto: {
    iterations: (process.env.NODE_ENV === 'test' ? 1 : 12000),
    length: 128,
    digest: 'sha512',
  },
  providers: {
    github: {
      app_id: process.env.GITHUB_APP_ID || 'ea08e09854ed95cbe7ba',
      app_secret: process.env.GITHUB_APP_SECRET || '454cd08121aa94167d7060f4ea01a0dbaa9f44bd',
      callback_uri: 'http://localhost:3000/oauth/github',
      options: {
        scope: ['user:email'],
      },
    },
    facebook: {
      app_id: process.env.FACEBOOK_APP_ID || '271730287615321',
      app_secret: process.env.FACEBOOK_APP_SECRET || '219af7001d81fe38f9e145b932305e31',
      callback_uri: 'http://localhost:3000/oauth/facebook',
      options: {
        scope: ['email'],
      },
    },
    vkontakte: {
      app_id: process.env.VKONTAKTE_APP_ID || '7535642',
      app_secret: process.env.VKONTAKTE_APP_SECRET || 'uuaZhyT8N0MWbhnxvleT',
      callback_uri: 'http://localhost:3000/oauth/vkontakte',
      options: {
        scope: ['email'],
      },
    },
  },
  mailer: {
    user: '',
    password: '',
  },
};
