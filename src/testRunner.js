const chalk           = require('chalk');
const time            = require('exectimer');
const config          = require('./config/config');
const mongo           = require('./config/mongo');
const view           = require('./view/monitor');
const validator       = require('validator');
const Bluebird        = require('bluebird');


// You can change the type of chatbot here
let apiFacade = require('./messengerFacade');
let db;
let options;

function executeTest(jsonInput){

  let metricsColl = Bluebird.promisifyAll(db.collection('metrics'));
  let metrics = [];

  return apiFacade.getApi(jsonInput, config)
    .then((api) => {
        if(options.verbose) {
          console.log("Connected to api. Starting tests...");
        }
        return Bluebird.each(jsonInput.tests, function(test) {
          return apiFacade.listenResponse(api, test, jsonInput.pageId)
          .then((resp) => {
            resp.date = new Date();
            if(assertResponse(test.responses, resp.response)){
              resp.state = 0;
              resp.message = `[${test.testTitle}] --> PASS`;
              console.log(chalk.green(resp.message));
              metrics.push(resp);
              return Bluebird.resolve(resp);
            } else {
              resp.state = 1;
              resp.message = `[${resp.question}] haven't good answer [${resp.response}]`;
              console.log(chalk.red(`${resp.message} --> FAILED`));
              metrics.push(resp);
              if(jsonInput.config.stopOnError === true)
                return Bluebird.reject(resp);
              else
                return Bluebird.resolve(resp);
            }
          });
        })
        .catch((err) => {
          if(options.verbose) {
            console.log("Test failed and stopOnError activated. Stopping...");
          }
        });
    }).finally(() => {
      if(options.verbose) {
        console.log("Sending metrics to db...");
      }
      return metricsColl.insertAsync({ metrics })
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
  let correct = false;

  expects.forEach((expecting) => {
    let rx = new RegExp(expecting.replace("%%", ".*"), "i");

    if (actual.match(rx)) {
      correct = true;
    }
  });

  return correct;
}

function verifyJson(parsedJSON) {
  return new Promise(function(resolve, reject) {

    if(!parsedJSON.pageId
      || !validator.isAlphanumeric("" + parsedJSON.pageId)) {;
      return reject("Error config : Wrong pageID");
    }

    if(parsedJSON.config.stopOnError === undefined
      || !(parsedJSON.config.stopOnError === true || parsedJSON.config.stopOnError === false)) {
      return reject("Error config : Wrong config.stopOnError : need true of false as value");
    }

    if(!parsedJSON.tests
      || !Array.isArray(parsedJSON.tests)){
      return reject("Error config : tests is not an array");
    }

    resolve(parsedJSON);
  });
}

function run(opts) {

  options = opts;

  mongo(config.mongo.url)
    .then((dbInfos) => {
      db = dbInfos;
      return readFile(options.src);
    })
    .then((content) => verifyJson(content))
    .then((content) => executeTest(content))
    .then((resp) => {
      if(options.verbose) {
        console.log("Exiting..");
      }
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = {
  readFile,
  verifyJson,
  assertResponse,
  run
};
