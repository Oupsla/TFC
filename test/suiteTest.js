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

  describe('Read and Validate config file', function () {

    it('should open the file', function(done){
      appRunner
        .readFile('../test/exampleTest.json')
        .should.eventually.have.property("pageId")
        .notify(done);
    });


    it('should reject cause the file don\'t exist', function(done){
      appRunner
        .readFile('../test/exampleDontExist.json')
        .should.be.rejected
        .notify(done);
    });


  });

});
