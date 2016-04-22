var MockAWSSinon = require('../');
var AWS = require('aws-sdk');
var assert = require('assert');

describe("AWS Mock Sinon", function() {

    it("Should mock a request", function(done) {

        MockAWSSinon('S3', 'getObject').returns({
            what: 'yes'
        });

        new AWS.S3().getObject({
            Bucket: 'what'
        }, function(err, resp) {
            assert.equal(resp.what, 'yes');
            assert.equal(MockAWSSinon('S3', 'getObject').calledOnce, true);
            done();
        })
    });

    it("Should allow you to use a function that returns immediately", function(done) {
        MockAWSSinon('S3', 'putObject', function(params, cb) {
            return "hello"
        })

        new AWS.S3().putObject({
            test: 'test'
        }, function(err, resp) {
            assert.equal(resp, "hello");
            done();
        })
    })

     it("Should allow you to use a function that uses a callback", function() {
        MockAWSSinon('S3', 'putObject', function(params, cb) {
            cb(null, "hello")
        })

        new AWS.S3().putObject({
            test: 'test'
        }, function(err, resp) {
            assert.equal(resp, "hello");
        })
    })

    
})