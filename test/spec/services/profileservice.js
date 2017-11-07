'use strict';

describe('Service: profileservice', function () {

  // load the service's module
  beforeEach(module('dmsAdminApp'));

  // instantiate service
  var profileservice;
  beforeEach(inject(function (_profileservice_) {
    profileservice = _profileservice_;
  }));

  it('should do something', function () {
    expect(!!profileservice).toBe(true);
  });

});
