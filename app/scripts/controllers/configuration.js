'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:Configuration
 * @description
 * # ConfigurationCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('ConfigurationCtrl', function ($scope, $state, session, settings) {
      $scope.isStarted = false;
  })