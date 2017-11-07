'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
.controller('DashboardCtrl', function ($scope, serviceservice, userservice) {


  serviceservice.getServiceList({},{}, function(data){
    if(data.statusCode == 200){
      $scope.serviceCount = data.body.count;
    }
  });

  userservice.getUserList({
    roles : "user"
  }, {}, function(data) {
    if (data.statusCode == 200) {
      $scope.userCount = data.body.count;
    }
  })
  userservice.getUserList({
    roles : "marketing_manager"
  }, {}, function(data) {
    if (data.statusCode == 200) {
      $scope.mmCount = data.body.count;
    }
  })
  userservice.getUserList({
    roles : "service_adviser"
  }, {}, function(data) {
    if (data.statusCode == 200) {
      $scope.saCount = data.body.count;
    }
  })
  userservice.getUserList({
    roles : "service_scheduler"
  }, {}, function(data) {
    if (data.statusCode == 200) {
      $scope.ssCount = data.body.count;
    }
  })
  userservice.getUserList({
    roles : "used_car_manager"
  }, {}, function(data) {
    if (data.statusCode == 200) {
      $scope.ucCount = data.body.count;
    }
  })
  });
