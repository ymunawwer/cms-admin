'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:MofferCtrl
 * @description
 * # MofferCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('MofferCtrl', function ($scope, serviceservice, $state, $stateParams, session, settings) {
    $scope.serviceList = [];
    $scope.servicelimit = 10;
    $scope.servicestart = 0;
    $scope.servicepage = 1;
    // $scope.mileageList ={};
    // $scope.mileageList.mileage =[];
    $scope.admin = session.get('admin');
    $scope.manufacturs = $scope.admin.manufactur;
    settings.getSetting({}, {}, function (data) {
      $scope.settings = data.body.setting;
      $scope.manufacturs = $scope.settings.manufactur;
      if ($scope.manufacturs) {
        serviceservice.getMileageList({ id: $scope.manufacturs }, {}, function (data) {
          if (data.statusCode === 200) {
            $scope.mileageList = data.body.items;
            console.log('munish')
            console.log($scope.mileageList)
          }
        });
      }
    });
    if (!$scope.manufacturs) {
      serviceservice.getManufactureList({}, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.makesList = data.body.manufacture;
        }
      })

    }

    $scope.changeSelectMake = function (make) {
      console.log(make)
      serviceservice.getMileageList({ id: make }, {}, function (data) {
        if (data.statusCode === 200) {
          $scope.mileageList = data.body.items;
          console.log($scope.mileageList)
        }
      });

    }



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
      console.log(service)
      if (service.checked && $scope.selected.indexOf(service._id) === -1) {
        $scope.selected.push(service._id);
        $scope.selectedservices.push(service);
      } else {
        var pos = $scope.selected.indexOf(service._id);
        var posO = $scope.selectedservices.indexOf(service);
        $scope.selected.splice(pos, 1);
        $scope.selectedservices.splice(posO, 1)
      }
      console.log($scope.selectedservices)
    }

    $scope.selectedmiles = $scope.selectedmiles || [];
    $scope.selectMileages = function (service) {
      console.log(service)
      if ($scope.selectedmiles.indexOf(service) === -1) {
        $scope.selectedmiles.push(service);
      } else {
        var posO = $scope.selectedmiles.indexOf(service);
        $scope.selectedmiles.splice(posO, 1)
      }
      console.log($scope.selectedmiles)
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
    $scope.list = {};
    $scope.addMOfferList = function () {
      if ($scope.addServiceForm.$valid) {
        if ($scope.selectedmiles.length == 0) {
          Materialize.toast('<span>Please select mileage</span>', 3000);
          return false;
        }
        if ($scope.selected.length == 0) {
          Materialize.toast('<span>Please select services</span>', 3000);
          return false;
        }
        // $scope.serviceData.make = $scope.serviceData.make.name;
        $scope.list.services = $scope.selected;
        $scope.list.mileage = $scope.selectedmiles;

        serviceservice.addMOfferLists({}, $scope.list, function (data) {
          if (data.statusCode === 200) {
            // if (data.body.already.length != 0) {
            //   var string = '';
            //   for (var i = 0; i < data.body.already.length; i++) {
            //     string = data.body.already[i].item.mileage + ',' + string;
            //   }
            //   $scope.already = data.body.already;
            //   Materialize.toast('<span> A maintenance schdule offer with the same milleage and service items is already present. Plase change the milleage or service item</span>', 3000);
            //   $state.go('home.list-offer');
            // }else{
            Materialize.toast('<span>' + data.message + '</span>', 3000);
            $state.go('home.list-offer');
            // }
          } else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }
    if ($stateParams.id) {
      serviceservice.getSingleMOfferLists({ id: $stateParams.id }, {}, function (data) {
        if (data.statusCode === 200) {
          $scope.list = data.body.items;
          $scope.list.services.map(function (v) {
            // $scope.selectService(v)
            v.checked = true;
            $scope.selected.push(v._id);
            $scope.selectedservices.push(v);
            return v;
          });
          console.log($scope.selectedservices)
        } else {
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      })
    }
    $scope.updateMOfferList = function () {
      if ($scope.addServiceForm.$valid) {
        // $scope.serviceData.make = $scope.serviceData.make.name;
        $scope.list.services = $scope.selected;
        serviceservice.updateMOfferLists({ id: $stateParams.id }, $scope.list, function (data) {
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
