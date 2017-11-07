'use strict';

describe('Controller: ServiceaddCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var ServiceaddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServiceaddCtrl = $controller('ServiceaddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ServiceaddCtrl.awesomeThings.length).toBe(3);
  });
});
