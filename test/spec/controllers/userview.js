'use strict';

describe('Controller: UserviewCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var UserviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserviewCtrl = $controller('UserviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UserviewCtrl.awesomeThings.length).toBe(3);
  });
});
