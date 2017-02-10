const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  facebook: {
    login: process.env.FACEBOOK_LOGIN || 'login',
    password: process.env.FACEBOOK_PASSWORD || 'password',
  }
};

module.exports = config;
