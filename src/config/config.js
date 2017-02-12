const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  facebook: {
    login: process.env.FACEBOOK_LOGIN,
    password: process.env.FACEBOOK_PASSWORD,
  },
  mongo: {
    url: 'mongodb://' + process.env.DBUSER + ':' +  process.env.DBPASS + '@ds035059.mlab.com:35059/tfc'
  }
};

module.exports = config;
