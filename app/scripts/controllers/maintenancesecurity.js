'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:MaintenancesecurityCtrl
 * @description
 * # MaintenancesecurityCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('MaintenancesecurityCtrl', function($scope, settings) {
    settings.getSetting({}, {}, function(data) {
      $scope.settings = data.body.setting;
    });

    $scope.updateSecurity = function() {
      settings.updateSetting({}, $scope.settings, function(data) {
        if (data.statusText == 'success') {
          $scope.security = null;
          Materialize.toast('<span>Maintenance key updated Successfully</span>', 3000);
        } else {
          var message = data.statusMessage;
          Materialize.toast('<span>' + message + '</span>', 3000);
        }
      });
    }
  });
