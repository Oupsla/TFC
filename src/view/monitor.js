'use strict';

const Bluebird = require('bluebird');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const config = require('../config/config');
const mongo = require('../config/mongo');
let db;

module.exports = {
  monitor() {
    const screen = blessed.screen();
    const grid = new contrib.grid({rows: 12, cols: 12, screen: screen})
    let metricsColl;

    mongo(config.mongo.url)
      .then((dbInfos) => {
        db = dbInfos;
        metricsColl = Bluebird.promisifyAll(db.collection('metrics'));

        return findMetrics(metricsColl, {});
      })
      .then((metrics) => {
        let metricsFiltered = transformMetrics(metrics);
        // let line = contrib.line(
        //  {
        //   style: {
        //     line: "yellow",
        //     text: "green",
        //     baseline: "black"
        //   },
        //   xLabelPadding: 3,
        //   yLabel: "nanosecondes",
        //   xPadding: 5,
        //   label: 'Temps d\'exécution des questions'
        // });

        let data = {
          title: "COucou",
          x: metricsFiltered.map((val, key) => '' + key),
          y: metricsFiltered
        };

        let lineParams = {
          style: {
            line: "yellow",
            text: "green",
            baseline: "black"
          },
          xLabelPadding: 3,
          yLabel: "nanosecondes",
          xPadding: 5,
          label: 'Temps d\'exécution des questions'
        };

        // screen.append(line); //must append before setting data
        let line = grid.set(0, 2, 12, 10, contrib.line, lineParams);
        line.setData([data]);

        // var table = contrib.table(
        //    { keys: true
        //    , vi: true
        //    , fg: 'white'
        //    , selectedFg: 'white'
        //    , selectedBg: 'blue'
        //    , interactive: true
        //    , label: 'Active Processes'
        //    , width: '30%'
        //    , height: '30%'
        //    , border: {type: "line", fg: "cyan"}
        //    , columnSpacing: 10
        //    , columnWidth: [16, 12]})
        let metricsArray = metrics.reduce((array, metric) => [...array, ...metric.metrics], []);
        let questionArray = ['ALL'];

        let tableParams = { keys: true
           , vi: true
           , fg: 'white'
           , selectedFg: 'white'
           , selectedBg: 'blue'
           , interactive: true
           , label: 'Active Processes'
           , width: '30%'
           , height: '30%'
           , border: {type: "line", fg: "cyan"}
           , columnSpacing: 10
           , columnWidth: [16, 12]
         };

        // screen.append(table);

        let table = grid.set(0, 0, 12, 2, contrib.table, tableParams);

        table.setData(
         { headers: ['Questions']
         , data: metricsArray.reduce((array, metric) => {
              if (questionArray.indexOf(metric.question) === -1) {
                questionArray.push(metric.question);
                return [...array, [metric.question]];
              }
              return array;
            }, [['ALL']])
        });
        table.focus();

        let index = 0;
        screen.key(['escape', 'q', 'C-c', 'p', 'm', 'up', 'down'], function(key, sequence) {
          // console.log(sequence);
          // console.log(key);
          if (sequence.name === 'down') { //up
            // console.log(table.data);
            metricsFiltered = transformMetrics(metrics, questionArray[index === questionArray.length - 1 ? index : ++index]);
            data = {
              x: metricsFiltered.map((val, key) => '' + key),
              y: metricsFiltered
            };
            line.setData([data]);
          } else if (sequence.name === 'up') {
            metricsFiltered = transformMetrics(metrics, questionArray[index === 0 ? index : --index]);
            data = {
              x: metricsFiltered.map((val, key) => '' + key),
              y: metricsFiltered
            };
            line.setData([data]);
          } else {
            return process.exit(0);
          }
        });
        screen.render();
      })
      .catch((err) => console.error(err));
  }
};

function transformMetrics(metrics, question) {
  // console.log(metrics);
  let metricsArray = metrics.reduce((array, metric) => [...array, ...metric.metrics], []);
  let metricsByQuestion = [];
  question = question === 'ALL' ? null : question;

  metricsArray.forEach((metric) => {
    if (question && metric.question === question) {
      metricsByQuestion.push(metric.time);
    } else if (!question) {
      metricsByQuestion.push(metric.time);
    }
  });

  return metricsByQuestion;
}

function findMetrics(metricsColl, query) {
  return new Bluebird((resolve, reject) => {
    metricsColl.find({}).toArray(function(err, docs) {
      if (err) {
        return reject(err);
      }
      return resolve(docs);
    });
  });
}
