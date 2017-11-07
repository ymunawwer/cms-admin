'use strict';

describe('Service: serviceservice', function () {

  // load the service's module
  beforeEach(module('dmsAdminApp'));

  // instantiate service
  var serviceservice;
  beforeEach(inject(function (_serviceservice_) {
    serviceservice = _serviceservice_;
  }));

  it('should do something', function () {
    expect(!!serviceservice).toBe(true);
  });

});
