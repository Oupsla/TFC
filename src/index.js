const Bluebird        = require('bluebird');
const login           = Bluebird.promisify(require("facebook-chat-api"));
const config          = require('../config');
const fs              = require('fs');
const exampleTests    = require('../test/exampleTest.json');
const assert          = require('assert');
const chalk           = require('chalk');
const time            = require('exectimer');
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', type: String, defaultOption: true},
];
const options = commandLineArgs(optionDefinitions)

Bluebird.promisifyAll(fs);

function executeTest(jsonInput) {

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
            })
            .catch((err) => {
              console.log(chalk.red(`${err.message} --> FAILED`));
              return Bluebird.reject(err);
            });
      });
  });
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
      let content = require(fileName);
      resolve(content);
    } catch (e) {
      reject("Cannot find file : " + fileName);
    }
  });
}

function assertResponse(expects, actual) {
  return expects.indexOf(actual) !== -1 ;
}

function verifyJson(parsedJSON) {
  return new Promise(function(resolve, reject) {
    //TODO: check json parsed
    if(false) {
      reject("Wrong json format");
    }
    resolve(parsedJSON);
  });
}

function main() {
  
  if(!options.src){
    console.error("Error : You have to specify a config file (.json)");
    process.exit(1);
  }

  readFile(options.src)
    .then((content) => verifyJson(content))
    .then((content) => executeTest(content))
    .then((resp) => console.log(resp))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

return main();


// {
//   question: "",
//   questionTitle: "",
//   executionTime: "",
//   response: ""
// }
