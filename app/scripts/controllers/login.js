'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('LoginCtrl', function ($scope, $state, session, authservice, $location) {
    var verify_token = null;
    var verification_link = $location.search().verify;
    if (typeof verification_link != "undefined") {
      if (verification_link == "true") {
        $scope.success_notification = "Successfully Verified."
      }
      else {
        $scope.error_notification = "Invalid Token."
      }
    }
    $scope.userData = {
      platform: "web"
    };
    $scope.close = function () {
      $scope.error = '';
      $scope.success = '';
    }
    $scope.loginUser = function () {
      if ($scope.loginForm.$valid) {
        authservice.login({}, $scope.userData, function (data) {
          if (data.statusCode === 200) {
            session.set('accesstoken', data.body.accesstoken);
            session.set('admin', data.body);
            if (data.body.setting_finish_status == false)
              $state.go('configuration');
            else
              $state.go('home.dashboard');
            Materialize.toast('<span>' + "Welcome Admin" + '</span>', 3000);
          }
          else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }



    $scope.forgetPassword = function () {
      if ($scope.sendLinkForm.$valid) {
        console.log($scope.userData);
        authservice.forgetPassword({}, $scope.userData, function (data) {
          if (data.statusCode === 200) {
            $scope.userData.email = '';
            $state.go('login');
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          } else {
            $scope.userData.email = '';
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })

      }
    }
    $scope.resetPassword = function () {
      if ($scope.resetPasswordForm.$valid) {
        if ($location.$$search.url) {
          if ($scope.userData.cpassword == $scope.userData.password) {
            authservice.resetPassword({
              token: $location.$$search.url
            }, $scope.userData, function (data) {
              if (data.statusCode === 200) {
                Materialize.toast('<span>' + data.message + '</span>', 3000);
                $state.go('login');
              } else {
                Materialize.toast('<span>' + data.message + '</span>', 3000);
              }
            })
          } else {
            Materialize.toast('<span>' + "The passwords do not match." + '</span>', 3000);
          }
        } else {
          Materialize.toast('<span>' + "Sorry something went wrong please try again letter." + '</span>', 3000);
        }
      } else {
        Materialize.toast('<span>' + "Please enter password." + '</span>', 3000);
      }
    }
  });
