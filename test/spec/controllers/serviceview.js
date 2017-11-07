'use strict';

describe('Controller: ServiceviewCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var ServiceviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServiceviewCtrl = $controller('ServiceviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ServiceviewCtrl.awesomeThings.length).toBe(3);
  });
});
