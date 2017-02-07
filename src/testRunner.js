const Bluebird        = require('bluebird');
const login           = Bluebird.promisify(require("facebook-chat-api"));
const assert          = require('assert');
const chalk           = require('chalk');
const time            = require('exectimer');
const config          = require('./config/config');
const mongo          = require('./config/mongo');
let db;
const validator       = require('validator');

let options;

function executeTest(jsonInput) {
  let metricsColl = Bluebird.promisifyAll(db.collection('metrics'));
  let metrics = [];
  let pageId = jsonInput.pageId
  let email = config.facebook.login;
  let password = config.facebook.password;

  if(options.verbose) {
    console.log("Facebook pageId : " + pageId);
  }

  return login({ email, password })
    .then((api) => {
      Bluebird.promisifyAll(api);
      api.setOptions({
        logLevel: "silent"
      });

      return Bluebird.each(jsonInput.tests, function(test) {
          return listenResponse(api, test, pageId)
            .then((resp) => {
              console.log(chalk.green(resp.message));
              metrics.push(resp);
            })
            .catch((err) => {
              console.log(chalk.red(`${err.message} --> FAILED`));
              metrics.push(err);
              return Bluebird.reject(err);
            });
      });
  }).finally(() => metricsColl.insertAsync({ metrics }));
}

function listenResponse(api, test, pageId) {
  let tick = new time.Tick("begin");
  tick.start();
  return new Bluebird((resolve, reject) => {
    api.sendMessage(test.question, pageId);
    let stopListening = api.listen(function(err, event) {
      if (err) {
        return reject(err);
      }

      if (event.type === 'message') {
        tick.stop();
        stopListening();
        //TIME IN NANOSECONDS
        if(assertResponse(test.responses, event.body)){
          resolve({message: `[${test.testTitle}] --> PASS`, question: test.question, response: event.body, time: time.timers.begin.duration(), state: 0});
        } else {
          reject({message: `[${test.question}] haven't good answer [${event.body}]`, question: test.question, response: event.body, time: time.timers.begin.duration(), state: 1});

        }
      }
    });
  });
}

function readFile(fileName) {
  return new Promise(function(resolve, reject) {
    try {
      let content = require('../' + fileName);
      resolve(content);
    } catch (e) {
      reject("Error : Cannot find file : " + fileName);
    }
  });
}

function assertResponse(expects, actual) {
  return expects.indexOf(actual) !== -1 ;
}

function verifyJson(parsedJSON) {
  return new Promise(function(resolve, reject) {
    if(!validator.isAlphanumeric(parsedJSON.pageId)) {
      reject("Error config : Wrong pageID");
    }

    if(!validator.isBoolean("" + parsedJSON.config.stopOnError)) {
      reject("Error config : Wrong config.stopOnError : need true of false");
    }

    if(!Array.isArray(parsedJSON.tests)){
      reject("Error config : tests is not an array");
    }


    resolve(parsedJSON);
  });
}

function run(opts) {

  options = opts;

  mongo('mongodb://dev:dev@ds035059.mlab.com:35059/tfc')
    .then((dbInfos) => {
      db = dbInfos;
      return readFile(options.src);
    })
    .then((content) => verifyJson(content))
    .then((content) => executeTest(content))
    .then((resp) => console.log(resp))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = {
  executeTest,
  readFile,
  verifyJson,
  run
};
