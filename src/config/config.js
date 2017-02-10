const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  facebook: {
    login: process.env.FACEBOOK_LOGIN || 'opl.testframework@gmail.com',
    password: process.env.FACEBOOK_PASSWORD || 'iagl4242',
  }
};

module.exports = config;
