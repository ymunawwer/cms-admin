'use strict';

describe('Controller: MaintenancesecurityCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var MaintenancesecurityCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaintenancesecurityCtrl = $controller('MaintenancesecurityCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MaintenancesecurityCtrl.awesomeThings.length).toBe(3);
  });
});
