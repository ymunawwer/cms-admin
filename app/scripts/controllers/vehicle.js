'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:VehicleCtrl
 * @description
 * # VehicleCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('VehicleCtrl', function ($scope, vehicleservice) {
    $scope.vehicleList = [];
    $scope.vlimit = 10;
    $scope.vstart = 0;
    $scope.vpage = 1;
    $scope.where={};
    $scope.where['limit'] = $scope.vlimit;
    $scope.where['skip'] = $scope.vstart;
    vehicleservice.getVehicleList($scope.where, {}, function(data) {
      if (data.statusCode == 200) {
        $scope.vehicleList = data.body.vehicle;
        $scope.vehicleCount = data.body.count;
        $scope.vtotalPages = Math.ceil($scope.vehicleCount / $scope.vlimit);
      }
    })

    $scope.vehiclepaginate = function(page) {
      if (page == 0 || $scope.vtotalPages < page)
        return false;

      $scope.vstart = page * $scope.vlimit - $scope.vlimit;
      $scope.vlimit = 10;
      $scope.vpage = page;
      vehicleservice.getVehicleList({
        limit: $scope.vlimit,
        skip: $scope.vstart
      }, {}, function(data) {
        if (data.statusCode == 200) {
          $scope.vehicleList = data.body.vehicle;
          $scope.vehicleCount = data.body.count;
          $scope.vtotalPages = Math.ceil($scope.vehicleCount / $scope.vlimit);
        }
      })
    }

    $scope.vehicleDeletePopUp = function(id, index) {
        $scope.vehicleId = id;
        $scope.vehicleIndex = index;
        $('#modal2').openModal({});
    }

    $scope.vehicleDelete = function() {
      vehicleservice.deleteVehicle({
        id: $scope.vehicleId
      }, {}, function(data) {
        if (data.statusCode == 200) {
          $('#modal2').closeModal({});
          vehicleservice.getVehicleList({
            limit: $scope.vlimit,
            skip: $scope.vstart
          }, {}, function(data) {
            if (data.statusCode == 200) {
              $scope.vehicleList = data.body.vehicle;
              $scope.vehicleCount = data.body.count;
              $scope.vtotalPages = Math.ceil($scope.vehicleCount / $scope.vlimit);
            }
          })
        }
      })
    }

    $scope.deleteAllVehiclePopUp = function(id, index) {
        $('#modal1').openModal({});
    }



    $scope.vehicleDeleteAll = function() {
      vehicleservice.deleteVehicles({}, {}, function(data) {
        if (data.statusCode == 200) {
          $('.modal').closeModal({});
          vehicleservice.getVehicleList({
            limit: $scope.vlimit,
            skip: $scope.vstart
          }, {}, function(data) {
            if (data.statusCode == 200) {
              $scope.vehicleList = data.body.vehicle;
              $scope.vehicleCount = data.body.count;
              $scope.vtotalPages = Math.ceil($scope.vehicleCount / $scope.vlimit);
            }
          })
        }
      })
    }
    $scope.vehiclerange = function() {
      var rangeSize = 5;
      var ret = [];
      var start;

      start = $scope.vpage;
      if (start > $scope.vtotalPages - rangeSize) {
        start = $scope.vtotalPages - rangeSize + 1;
      }

      for (var i = start; i < start + rangeSize; i++) {
        if (i > 0)
          ret.push(i);
      }
      return ret;
    };
  })
  .directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }])
