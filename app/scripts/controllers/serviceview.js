'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:ServiceviewCtrl
 * @description
 * # ServiceviewCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('ServiceviewCtrl', function ($scope, serviceservice) {

    $scope.serviceList = [];
    $scope.servicelimit = 10;
    $scope.servicestart = 0;
    $scope.servicepage = 1;
    serviceservice.getServiceList({
      limit: $scope.servicelimit,
      skip: $scope.servicestart
    }, {}, function (data) {
      if (data.statusCode == 200) {
        $scope.serviceList = data.body.services;
        $scope.serviceCount = data.body.count;
        $scope.servicetotalPages = Math.ceil($scope.serviceCount / $scope.servicelimit);
      }
    })

    $scope.servicedelete = function (id, index) {
      serviceservice.deleteService({ id: id }, {}, function (data) { if (data.statusCode == 200) { $scope.serviceList.splice(index, 1); } })
    }
    $scope.servicepaginate = function (page) {
      console.log(page);
      console.log($scope.servicetotalPages);
      if (page == 0 || $scope.servicetotalPages < page)
        return false;

      $scope.servicestart = page * $scope.servicelimit - $scope.servicelimit;
      $scope.servicelimit = 10;
      $scope.servicepage = page;
      serviceservice.getServiceList({
        limit: $scope.servicelimit,
        skip: $scope.servicestart
      }, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.serviceList = data.body.services;
          $scope.serviceCount = data.body.count;
          $scope.servicetotalPages = Math.ceil($scope.serviceCount / $scope.servicelimit);
        }
      })
    }
    $scope.servicerange = function () {
      var rangeSize = 5;
      var ret = [];
      var start;

      start = $scope.servicepage;
      if (start > $scope.servicetotalPages - rangeSize) {
        start = $scope.servicetotalPages - rangeSize + 1;
      }

      for (var i = start; i < start + rangeSize; i++) {
        if (i > 0)
          ret.push(i);
      }
      return ret;
    };
  });
