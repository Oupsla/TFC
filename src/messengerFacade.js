const Bluebird        = require('bluebird');
const login           = Bluebird.promisify(require("facebook-chat-api"));
const time            = require('exectimer');

function getApi(jsonInput, config) {
  let pageId = jsonInput.pageId
  let email = config.facebook.login;
  let password = config.facebook.password;
  return login({ email, password })
    .then((api) => {
      Bluebird.promisifyAll(api);
      api.setOptions({
        logLevel: "silent"
      });
      return Bluebird.resolve(api);
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
        return resolve({question: test.question, response: event.body, time: time.timers.begin.duration()});
      }
    });
  });
}

module.exports = {
  getApi,
  listenResponse
};
