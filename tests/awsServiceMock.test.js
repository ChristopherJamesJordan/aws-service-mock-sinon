/**
 * AWS Service Mock Module tests
 */
const AWS = require('aws-sdk');
const assert = require('assert');
const { createAwsMock,
  getAwsMock, deleteAwsMock } = require('../awsServiceMock');

describe('#awsServiceMock', function () {
  afterEach(function() {
    // Remove the AWS SQS mock(s) for cleaner testing
    deleteAwsMock('SQS', 'sendMessage');
    deleteAwsMock('S3', 'getObject');
    deleteAwsMock('S3', 'putObject');
  });

  describe('#getAwsMock @unit', function () {
    it('Should allow calledOnce assert calls on awsMock', function (done) {
      createAwsMock('S3', 'getObject', () => {
        return {
          what: 'yes',
        }
      });

      new AWS.S3().getObject({
        Bucket: 'what',
      },
      (err, resp) => {
        assert.equal(resp.what, 'yes');
        assert.equal(getAwsMock('S3', 'getObject').calledOnce, true);
        done();
      });
    });

    it('Returns null if the requested stub does not exist', function (done) {
      assert.equal(getAwsMock('S3', 'getObject'), null);
      done();
    });
  });

  describe('#createAwsMock @unit', function () {
    it('Should allow you to use a function that returns immediately', function (done) {
      createAwsMock('S3', 'putObject', (params, cb) => { // eslint-disable-line no-unused-vars
        const reply = 'hello';
        return reply;
      });

      new AWS.S3().putObject({
        test: 'test',
      },
      (err, resp) => {
        assert.equal(resp, 'hello');
        done();
      });
    });

    it('Should allow you to use a function that uses a callback', function (done) {
      createAwsMock('S3', 'putObject', (params, cb) => {
        cb(null, 'hello');
      });

      new AWS.S3().putObject({
        test: 'test',
      },
      (err, resp) => {
        assert.equal(resp, 'hello');
        done();
      });
    });
  });

  describe('#deleteAwsMock @unit', function () {
    it('Should remove a mock when requested', function (done) {
      createAwsMock('S3', 'putObject', (params, cb) => { // eslint-disable-line no-unused-vars
        const reply = 'hello';
        return reply;
      });

      deleteAwsMock('S3', 'putObject');

      assert.equal(getAwsMock('S3', 'getObject'), null);
      done();
    });
  });

  describe('#processAwsRequest @unit', function () {
    it('Should throw an error if an invalid mock is called', function (done) {
      assert.throws(
        function() {
          new AWS.S3().putObject({
            test: 'test',
          },
          (err, resp) => {
            assert.equal(resp, 'hello');
            done();
          });
        },
        /No stub response for/
      );
      done();
    });
  });
});
