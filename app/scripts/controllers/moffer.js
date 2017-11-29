'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:MofferCtrl
 * @description
 * # MofferCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('MofferCtrl', function ($scope, serviceservice, $state ) {
    $scope.serviceList = [];
    $scope.servicelimit = 10;
    $scope.servicestart = 0;
    $scope.servicepage = 1;
    
    $scope.getAllService = function (keyvalue) {
      serviceservice.getServiceList({
        key: keyvalue,
        sort: 'name',
        sort_type: 1,
        skip: $scope.servicestart,
        limit: $scope.servicelimit,
      }, {}, function (data) {
        if (data.statusCode === 200) {
          $scope.serviceMoreFlag = data.body.count > ($scope.servicestart + $scope.servicelimit);
          $scope.serviceList = data.body.services;
        }
      });
    }
    $scope.getAllService();
    $scope.selected = $scope.selected || [];
    $scope.selectedservices = $scope.selectedservices || [];
    $scope.selectService = function (service) {
      if (service.checked && $scope.selected.indexOf(service._id) === -1) {
        $scope.selected.push(service._id);
        $scope.selectedservices.push(service);
      } else {
        var pos = $scope.selected.indexOf(service._id);
        var posO = $scope.selectedservices.indexOf(service);
        $scope.selected.splice(pos, 1);
        $scope.selectedservices.splice(posO, 1)
      }
    }

    $scope.$watch('key', function (newValue, oldValue) {
      if (newValue && newValue != "") {
        $scope.skey = newValue
        $scope.getAllService(newValue)
      }
      if (!newValue || newValue == "") {
        $scope.getAllService()
      }
    });
    $scope.addMOfferList = function(){
      if ($scope.addServiceForm.$valid) {
        // $scope.serviceData.make = $scope.serviceData.make.name;
        $scope.list.services = $scope.selected;
        serviceservice.addMOfferLists({}, $scope.list, function(data) {
          if (data.statusCode === 200) {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
            $state.go('home.list-offer');
          } else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }

    serviceservice.getMOfferLists({}, {}, function (data) {
      if (data.statusCode === 200) {
        $scope.moffer = data.body.items;
      }
    });
  });
