const commandLineArgs     = require('command-line-args');
const optionDefinitions   = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', type: String, defaultOption: true},
];
const options             = commandLineArgs(optionDefinitions);
const testRunner          = require('./src/testRunner');


function main() {
  if(!options.src) {
    console.error("Error : You have to specify a config file (.json)");
    process.exit(1);
  }
  testRunner.run(options);
}

return main();
