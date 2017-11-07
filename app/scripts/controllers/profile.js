'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('ProfileCtrl', function ($scope, profileservice) {

    $scope.profileData = {};

    profileservice.getProfileData({}, {}, function(data){
      if(data.statusCode === 200){
        $scope.profileData = data.body.user;
      }
    });

    $scope.changePassword = function(){
      profileservice.changePassword({}, $scope.changepassword, function(data){
        if(data.statusCode === 200){
          $scope.changepassword.old_password = '';
          $scope.changepassword.password = '';
          $scope.changepassword.cpassword = '';
          Materialize.toast('<span>'+data.message+'</span>', 3000);
        }
        else{
          Materialize.toast('<span>'+data.message+'</span>', 3000);
        }
      });
    }
    $scope.updateProfile = function(){
      profileservice.updateProfile({}, $scope.profileData, function(data){
        if(data.statusCode === 200){
          $scope.profileData = data.body.user;
          $scope.admin.name = $scope.profileData.name;
          Materialize.toast('<span>'+data.message+'</span>', 3000);
        }
      });
    }
  });
