'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:UseraddCtrl
 * @description
 * # UseraddCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('UseraddCtrl', function ($scope, userservice) {

    $scope.userData = {};
  
    $scope.addUser = function(){
      if($scope.userAddForm.$valid && $scope.userData.password === $scope.userData.cpassword){
        userservice.addUser({}, $scope.userData, function(data){
          if(data.statusCode === 200){
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
          else{
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
        })
      }
    }
  });
