'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('LoginCtrl', function ($scope, $state, session, authservice, $location ) {
    var verify_token = null;
    var verification_link = $location.search().verify;
    if(typeof verification_link != "undefined") {
      if(verification_link == "true") {
        $scope.success_notification = "Successfully Verified."
      }
      else {
        $scope.error_notification = "Invalid Token."
      }
    }
    $scope.userData = {
      platform: "web"
    };
    $scope.close = function(){
      $scope.error='';
      $scope.success='';
    }
    $scope.loginUser = function(){
      if($scope.loginForm.$valid){
        authservice.login({}, $scope.userData, function(data){
          if(data.statusCode === 200){
            session.set('accesstoken', data.body.accesstoken);
            session.set('admin', data.body);
            $state.go('home.settings');
            Materialize.toast('<span>'+"Welcome Admin"+'</span>', 3000);
          }
          else{
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
        })
      }
    }

    $scope.forgetPassword = function(){
      if($scope.sendLinkForm.$valid){
        authservice.forgetPassword({}, $scope.userData, function(data){
          if(data.statusCode === 200){
            $scope.userData.email='';
            $state.go('login');
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
          else{
            $scope.userData.email='';
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
        })

      }
    }
    $scope.resetPassword = function(){
      if($scope.resetPasswordForm.$valid){
        authservice.resetPassword({}, $scope.userData, function(data){
          if(data.statusCode === 200){
            $state.go('login');
          }
          else{
            $scope.userData.email='';
            $scope.error = data.message;
          }
        })
      }
    }
  });
