'use strict';

describe('Controller: SettingctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('dmsAdminApp'));

  var SettingctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingctrlCtrl = $controller('SettingctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SettingctrlCtrl.awesomeThings.length).toBe(3);
  });
});
