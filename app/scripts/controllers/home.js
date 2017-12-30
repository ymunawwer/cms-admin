'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('HomeCtrl', function ($scope, $state, session, settings, $sce) {
    $scope.admin =session.get('admin');

  

    // settings.getAutoCheck({},{}, function(data) {
    //   $scope.autocheck = $sce.trustAsHtml(data.body);
    //   console.log($scope.autocheck)
    // });

    settings.getSetting({}, {}, function(data) {
      $scope.site = data.body.setting;
    });

    $scope.logout = function(){
      session.destroy('accesstoken');
    }
    $('.button-collapse').sideNav({
      menuWidth: 270, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens,
     }
  );
  });
