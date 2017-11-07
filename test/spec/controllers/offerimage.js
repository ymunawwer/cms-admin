'use strict';

describe('Controller: OfferimageCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var OfferimageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OfferimageCtrl = $controller('OfferimageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OfferimageCtrl.awesomeThings.length).toBe(3);
  });
});
