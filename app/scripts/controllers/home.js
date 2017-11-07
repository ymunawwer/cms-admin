'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('HomeCtrl', function ($scope, $state, session, settings) {
    $scope.admin =session.get('admin');
    settings.getSetting({}, {}, function(data) {
      $scope.site = data.body.setting;
    });

    $scope.logout = function(){
      console.log("hi");
      session.destroy('accesstoken');
      $state.go('login');
    }
  });
