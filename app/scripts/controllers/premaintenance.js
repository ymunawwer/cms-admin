'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:PremaintenanceCtrl
 * @description
 * # PremaintenanceCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
.controller('PremaintenanceCtrl', function($scope, serviceservice, $location) {


  serviceservice.getPreMaintenanceList({}, {}, function(data) {
    if (data.statusCode == 200) {
      $scope.premaintenance = data.body.maintenance;
      // $scope.serviceCount = data.body.count;
      // $scope.servicetotalPages = Math.ceil($scope.serviceCount / $scope.servicelimit);
    }
  })
  $scope.importPreToMaintenance = function(){
    serviceservice.importToMaintenance({}, {}, function(data) {
      console.log(data);
      if (data.statusCode === 200) {
        Materialize.toast('<span>' + data.message + '</span>', 3000);
        $location.path('maintenance')
      } else {
        Materialize.toast('<span>' + data.message + '</span>', 3000);
      }
    })
  }
});
