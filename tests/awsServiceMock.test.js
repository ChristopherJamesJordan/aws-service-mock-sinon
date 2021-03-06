/**
 * AWS Service Mock Module tests
 */
const AWS = require('aws-sdk');
const assert = require('assert');
const {
  createAwsMock,
  getAwsMock,
  updateAwsMock,
  deleteAwsMock,
} = require('../awsServiceMock');

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
        deleteAwsMock('S3', 'getObject');
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
        }, (err, resp) => {
          assert.equal(resp, 'hello');
          deleteAwsMock('S3', 'putObject');
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
        deleteAwsMock('S3', 'putObject');
        done();
      });
    });
  });

  describe('#updateAwsMock @unit', function () {
    it('Should allow you to update and use a function that returns immediately', function (done) {
      createAwsMock('SQS', 'sendMessage', (params, cb) => { // eslint-disable-line no-unused-vars
        const reply = 'hello';
        return reply;
      });

      new AWS.SQS().sendMessage({
          test: 'test',
        }, (err, resp) => {
          assert.equal(resp, 'hello');

          updateAwsMock('SQS', 'sendMessage', (params, cb) => { // eslint-disable-line no-unused-vars
            const reply = 'goodbye';
            return reply;
          });

          new AWS.SQS().sendMessage({
              test: 'test',
            }, (err, resp) => {
              assert.equal(resp, 'goodbye');
              deleteAwsMock('SQS', 'sendMessage');
              done();
            });
        });
    });

    it('Should allow you to update and use a function that uses a callback', function (done) {
      createAwsMock('SQS', 'sendMessage', (params, cb) => {
        cb(null, 'hello');
      });

      new AWS.SQS().sendMessage({
        test: 'test',
      },
      (err, resp) => {
        assert.equal(resp, 'hello');

        updateAwsMock('SQS', 'sendMessage', (params, cb) => { // eslint-disable-line no-unused-vars
          cb(null, 'goodbye');
        });

        new AWS.SQS().sendMessage({
            test: 'test',
          },
          (err, resp) => {
            assert.equal(resp, 'goodbye');
            deleteAwsMock('SQS', 'sendMessage');
            done();
          });
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
          new AWS.SSM().getParameters({
              Names: ['testParam1', 'testParam2', 'testParam3'],
              WithDecryption: true,
            }, (err, resp) => {
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
