'use strict';

const MongoClient = require('mongodb').MongoClient;
const Bluebird = require('bluebird');
// mongodb://dev:dev@ds035059.mlab.com:35059/tfc
module.exports = (url) => {
  return new Bluebird((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) {
        return reject(err);
      }

      let dbAsync = Bluebird.promisifyAll(db);
      console.log("Connected successfully to mongo server");

      process.on('SIGTERM', function () {
        db.close();
      });

      return resolve(dbAsync);
    });
  });
};
