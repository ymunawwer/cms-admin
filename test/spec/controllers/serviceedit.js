'use strict';

describe('Controller: ServiceeditCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var ServiceeditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServiceeditCtrl = $controller('ServiceeditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ServiceeditCtrl.awesomeThings.length).toBe(3);
  });
});
