'use strict';

describe('Controller: PremaintenanceCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var PremaintenanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PremaintenanceCtrl = $controller('PremaintenanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PremaintenanceCtrl.awesomeThings.length).toBe(3);
  });
});
