'use strict';

describe('Controller: UsereditCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var UsereditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsereditCtrl = $controller('UsereditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UsereditCtrl.awesomeThings.length).toBe(3);
  });
});
