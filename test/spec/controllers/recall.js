'use strict';

describe('Controller: RecallCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var RecallCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecallCtrl = $controller('RecallCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecallCtrl.awesomeThings.length).toBe(3);
  });
});
