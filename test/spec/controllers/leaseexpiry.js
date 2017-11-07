'use strict';

describe('Controller: LeaseexpiryCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var LeaseexpiryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LeaseexpiryCtrl = $controller('LeaseexpiryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LeaseexpiryCtrl.awesomeThings.length).toBe(3);
  });
});
