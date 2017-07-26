[![NPM](https://nodei.co/npm/aws-service-mock-sinon.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/aws-service-mock-sinon/)

[![npm version](https://badge.fury.io/js/aws-service-mock-sinon.svg)](https://badge.fury.io/js/aws-service-mock-sinon)[![Build Status](https://travis-ci.org/ChristopherJamesJordan/aws-service-mock-sinon.svg?branch=master)](https://travis-ci.org/ChristopherJamesJordan/aws-service-mock-sinon)[![Coverage Status](https://coveralls.io/repos/github/ChristopherJamesJordan/aws-service-mock-sinon/badge.svg?branch=master)](https://coveralls.io/github/ChristopherJamesJordan/aws-service-mock-sinon?branch=master)

# awsServiceMock

A quick and simple library that lets you use [Sinon](http://sinonjs.org) stubs with [aws-sdk](https://aws.amazon.com/sdk-for-node-js/).

### Why is this needed?

aws-sdk creates services in a weird way, so it isn't possible to do, say:

    sinon.stub(AWS.S3.prototype, "getObject").returns({
       an: "object"
    })

Because `AWS.S3.prototype` doesn't actually have a function called getObject. It is possible
to just stub an instance of `new AWS.S3`, but chances are you instantiating that in your non-test
code, and don't want to structure it weirdly just so that you can run tests properly.

### How do I use it?

#### Create Mock - createAwsMock(service, method, function)

##### Params

service: String - name of AWS service to be mocked
method: String - name of AWS service method to be mocked
function: Function() - callback function to replace AWS.service.method() call

##### Details

Then, rather than call `sinon.stub`, you can call this module as a function, which will return a stub. Like so:

    const { createAwsMock } = require('awsServiceMock');

    createAwsMock('S3', 'getObject').returns({
        an: 'object',
    });

    new AWS.S3().getObject({Bucket: 'test'}, function(err, response) {
        assert.equal(response.an, 'object'),
    });

#### Get Mock - getAwsMock(service, method)

##### Params

service: String - name of AWS service to be mocked
method: String - name of AWS service method to be mocked

##### Returns

awsMock: Object - Sinon Stub

##### Details

If you wish to use the Sinon verification helpers, you can get run the function again to retrieve the same
stub. So instead of doing:

    AWS.S3.prototype.getObject.calledOnce();

you write:

    const { getAwsMock } = require('awsServiceMock');

    getAwsMock('S3','getObject').calledOnce();

#### Update Mock - updateAwsMock(service, method, function)

##### Params

service: String - name of AWS service to be mocked
method: String - name of AWS service method to be mocked
function: Function() - callback function to replace AWS.service.method() call

##### Details

If you need to replace a mock, you can now call updateAwsMock() instead of
calling deleteAwsMock() followed by createAwsMock():

    const { updateAwsMock } = require('awsServiceMock');

    updateAwsMock('S3','getObject').returns({
        an: 'idea',
    });

    new AWS.S3().getObject({Bucket: 'test'}, function(err, response) {
        assert.equal(response.an, 'idea'),
    });

#### Delete Mock - deleteAwsMock(service, method)

##### Params

service: String - name of AWS service mock to be deleted
method: String - name of AWS service method mock to be deleted

##### Details

If you need to change the callback function for a mock, you must first delete the previous mock via the following:

    const { deleteAwsMock } = require('awsServiceMock');

    deleteAwsMock('S3','getObject');

It is recommended to call this in the afterEach() method for your tests as you may experience inconsistent behavior otherwise.

Updated v1.1.0: You can now chose to called updateAwsMock() at the beginning of each test where you need to change
the function callback. Both the afterEach() and updateAwsMock() approaches should solve any issues with mock collisions.

#### Clean Up

To restore the standard AWS Send functionally, you should call the following:

    const { restoreAwsRequestSend } = require('awsServiceMock');

    restoreAwsRequestSend();

### How does it actually work?

It stubs out AWS.Request.send, which *is* available. That stub then returns a mock AWS.Response object with the return value you have provided. This idea was copied from [fakeaws](https://github.com/k-kinzal/fakemock), which works great except that I couldn't find a way to call verification methods on stubbed code, which this allows you to do.

### Credits

This was originally forked from [mock-aws-sinon](https://github.com/gdnmobilelab/mock-aws-sinon), but was updated to use the latest dependency versions and functionally overhauled to add new features (breaking compared to the original source).

### Liability

This is a personal project I maintain on my own time. I will continue to extend and improve this as I am able. As such, this module is for use as is, with no guarantees or liability. Feel free to pursue the test cases for validation and please let me know if you have any feedback or find any bugs!
