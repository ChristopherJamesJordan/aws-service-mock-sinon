/**
 * AWS Service Mock Module tests
 */
const { createAwsMock, getAwsMock } = require('../awsServiceMock');
const AWS = require('aws-sdk');
const assert = require('assert');

describe('#awsServiceMock', function () {
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
});
