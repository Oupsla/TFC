const login     = require("facebook-chat-api");
const Promise   = require('bluebird');
const config    = require('./config');
const fs        = require('fs');

Promise.promisifyAll(fs);

function executeTest(jsonInput) {

  let pageId = jsonInput.pageId
  let email = config.facebook.login;
  let password = config.facebook.password;

  console.log("Facebook pageId : " + pageId);

  login({email: email, password: password}, function callback (err, api) {
      if(err) return console.error(err);

      api.setOptions({
        logLevel: "silent"
      });

      Promise.each(jsonInput.tests, function(test) {
          console.log("Test : " + test.testTitle);
          console.log("question : " + test.question);

          return new Promise(function (resolve, reject){
            api.sendMessage(test.question, pageId);
            let stopListening = api.listen(function(err, event) {
              console.log(event.body);
              stopListening();
              resolve();
            });
          });
      });
  });
}

function verifyJson(parsedJSON) {
  return true;
}

function main() {

  fs.readFileAsync("./exampleTest.json")
  .then(JSON.parse)
  .then((jsonParsed) => {
    if(verifyJson(jsonParsed))
      executeTest(jsonParsed);
    else
      Promise.reject("Wrong Json format");
  })
  .catch(SyntaxError, function (e) {
      console.error("invalid json in file");
  })
  .catch(function (e) {
      console.error("unable to read file");
  });


}

return main();
