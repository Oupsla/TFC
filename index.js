const commandLineArgs     = require('command-line-args');
const optionDefinitions   = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'monitor', alias: 'm', type: Boolean },
  { name: 'src', type: String, defaultOption: true},
];
const options             = commandLineArgs(optionDefinitions);
const getUsage            = require('command-line-usage')
const testRunner          = require('./src/testRunner');
const view                = require('./src/view/monitor');


const sections = [
  {
    header: 'TFC',
    content: 'Test Framework for Chatbot is to test your chatbot (messenger only at the moment).\nYou have to write tests in a json file (you can find an example in test/exampleTest.json).'
  },
  {
    header: 'Synopsis',
    content: [
      '$ node index.js [[bold]{-v} [bold]{-m}] [underline]{file.json}',
      '$ node index.js [bold]{--help}'
    ]
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'help', alias: 'h', description: 'Display this usage guide.'
      },
      {
        name: 'verbose', alias: 'v', description: 'Verbose mode.'
      },
      {
        name: 'monitor', alias: 'm', description: 'Display the monitor guide.'
      }
    ]
  }
];
const usage = getUsage(sections);


function main() {
  if (options.help){
    console.log(usage);
    process.exit(1);
    return;
  } else if(!options.src) {
    console.error("Error : You have to specify a config file (.json)");
    process.exit(1);
    return;
  } else if (options.monitor) {
    view.monitor();
  } else {
    testRunner.run(options);
  }
}

return main();
