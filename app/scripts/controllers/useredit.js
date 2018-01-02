'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:UsereditCtrl
 * @description
 * # UsereditCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp').controller('UsereditCtrl', function($scope, $stateParams, userservice) {

  var id = $stateParams.id;
  $scope.userData = {};
  $scope.roles = [
    { name: "admin", role: "admin" },
    { name: "user", role: "user" },
    { name: "marketing_manager", role: "MM" },
    { name: "used_car_manager", role: "UCM" },
    { name: "service_scheduler", role: "SS" },
    { name: "service_adviser", role: "SA" },
    { name: "vehicle​_inspection​", role: "VI" }
  ];

  $scope.selectedroles = $scope.selectedroles || [];

  userservice.getSingleUser({
    id: id
  }, {}, function(data) {
    if (data.statusCode == 200) {
      $scope.userData = data.body.user;
      $scope.selectedroles = $scope.userData.roles;
      $scope.roles.forEach(function(li, i) {
        if($scope.userData.roles.indexOf(li.name) !== -1){
          $scope.roles[i].status=true;
        }else{
          $scope.roles[i].status=false;
        }
      }); 
    }
  });
  $scope.addUser = function() {
    if($scope.selectedroles.length==0){
      Materialize.toast('<span>Please select atleast one roles</span>', 3000);
      return false;
    }
    if ($scope.userAddForm.$valid) {
      $scope.userData.roles = $scope.selectedroles;
      userservice.updateUser({
        id: id
      }, $scope.userData, function(data) {
        if (data.statusCode == 200) {
          $scope.userData = data.body.user;
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      })
    }
  }

  
    $scope.selectRoles = function (role) {
      if ($scope.selectedroles.indexOf(role) === -1) {
        $scope.selectedroles.push(role);
      } else {
        var posO = $scope.selectedroles.indexOf(role);
        $scope.selectedroles.splice(posO, 1)
      }
      console.log($scope.selectedroles)
    }
});
