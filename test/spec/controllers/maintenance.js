'use strict';

describe('Controller: MaintenanceCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var MaintenanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaintenanceCtrl = $controller('MaintenanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MaintenanceCtrl.awesomeThings.length).toBe(3);
  });
});
