const Bluebird   = require('bluebird');
const login     = Bluebird.promisify(require("facebook-chat-api"));
const config    = require('./config');
const fs        = require('fs');
const exampleTests = require('./exampleTest.json');
const assert    = require('assert');
const chalk    = require('chalk');
const time = require('exectimer');

Bluebird.promisifyAll(fs);

function executeTest(jsonInput) {

  let pageId = jsonInput.pageId
  let email = config.facebook.login;
  let password = config.facebook.password;

  console.log("Facebook pageId : " + pageId);

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

function verifyJson(parsedJSON) {
  return true;
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
        if (test.responses.indexOf(event.body) === -1) {
          reject({message: `[${test.question}] haven't good answer [${event.body}]`, question: test.question, response: event.body, time: time.timers.begin.duration(), state: 1});
        } else {
          resolve({message: `[${test.testTitle}] --> PASS`, question: test.question, response: event.body, time: time.timers.begin.duration(), state: 0});
        }
      }
    });
  });
}

function main() {

  executeTest(exampleTests)
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
