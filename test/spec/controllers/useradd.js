'use strict';

describe('Controller: UseraddCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var UseraddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UseraddCtrl = $controller('UseraddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UseraddCtrl.awesomeThings.length).toBe(3);
  });
});
