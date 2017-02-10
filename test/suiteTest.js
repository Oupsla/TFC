const Bluebird = require('bluebird');
const fs = require('fs');
const sinon = require('sinon');
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

const appRunner = require('../src/testRunner.js');

describe('Test Suite', function () {

  const sampleConfig = require('../test/exampleTest.json');
  const wrongConfig = require('../test/wrongConfig.json');
  const wrongConfig2 = require('../test/wrongConfig2.json');
  const wrongConfig3 = require('../test/wrongConfig3.json');

  describe('Read and Validate config file', function () {

    it('should open the file', function(done){
      appRunner
        .readFile('test/exampleTest.json')
        .should.eventually.have.property("pageId")
        .notify(done);
    });


    it('should reject cause the file don\'t exist', function(done){
      appRunner
        .readFile('../test/exampleDontExist.json')
        .should.be.rejected
        .notify(done);
    });

    it('should validate the json config', function(done){
      appRunner
        .verifyJson(sampleConfig)
        .should.be.fulfilled
        .notify(done);
    });

    it('should unvalidate the json config (undefined pageId)', function(done){
      appRunner
        .verifyJson(wrongConfig)
        .should.be.rejected
        .notify(done);
    });

    it('should unvalidate the json config 2 (wrong config.stopOnError)', function(done){
      appRunner
        .verifyJson(wrongConfig2)
        .should.be.rejected
        .notify(done);
    });

    it('should unvalidate the json config 3 (undefined tests)', function(done){
      appRunner
        .verifyJson(wrongConfig3)
        .should.be.rejected
        .notify(done);
    });


  });

  describe('Assert Tests', function () {

    const expectResponses = ['Coucou' , 'Salut', 'Hello'];
    const goodResponse = 'Coucou';
    const badResponse = 'Olé';

    it('should assert this response', function(done){
      var result = appRunner
        .assertResponse(expectResponses, goodResponse)
      assert.equal(result, true);
      done();
    });

    it('should refuse this response', function(done){
      var result = appRunner
        .assertResponse(expectResponses, badResponse)
      assert.equal(result, false);
      done();
    });

  });

});
