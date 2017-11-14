'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
    .controller('RegisterCtrl', function ($scope, $state, session, register) {
      $scope.userData = {
        platform: "web"
      };
      $scope.close = function(){
        $scope.error='';
        $scope.success='';
      }
      $scope.register = function(){
        if($scope.loginForm.$valid){
          register.saveDealar({}, $scope.userData, function(data){
            if(data.statusCode === 200){
              Materialize.toast('<span>'+"Successfully register dealer information "+'</span>', 3000);
            }
            else{
              Materialize.toast('<span>'+data.message+'</span>', 3000);
            }
          })
        }
      }
    });
  