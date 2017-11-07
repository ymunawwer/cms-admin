'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:MaintenanceCtrl
 * @description
 * # MaintenanceCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('MaintenanceCtrl', function($scope, serviceservice, session) {
    $scope.mlimit = 10;
    $scope.where = {};
    $scope.mstart = 0;
    $scope.mpage = 1;
    $scope.where['limit'] = $scope.mlimit
    $scope.where['skip'] = $scope.mstart
    serviceservice.getMaintenanceList($scope.where, {}, function(data) {
      if (data.statusCode == 200) {
        $scope.maintenance = data.body.maintenance;
        $scope.mCount = data.body.count;
        $scope.mtotalPages = Math.ceil($scope.mCount / $scope.mlimit);
      }
    })
    $scope.$watch('searchVin', function(newValue, oldValue) {
      $scope.mlimit = 10;
      $scope.where = {};
      $scope.mstart = 0;
      $scope.mpage = 1;
      $scope.where['limit'] = $scope.mlimit
      $scope.where['skip'] = $scope.mstart
      if (newValue == '') {
        session.destroy('keyvalue')
        serviceservice.getMaintenanceList($scope.where, {}, function(data) {
          if (data.statusCode == 200) {
            $scope.maintenance = data.body.maintenance;
            $scope.mCount = data.body.count;
            $scope.mtotalPages = Math.ceil($scope.mCount / $scope.mlimit);
          }
        })
      }
      if (newValue && newValue.length >= 1) {
        session.set('keyvalue', newValue)
        serviceservice.getMaintenanceListSearch({
          limit: $scope.mlimit,
          skip: $scope.mstart,
          key: newValue,
        }, {}, function(data) {
          if (data.statusCode == 200) {
            $scope.maintenance = data.body.maintenance;
            $scope.mCount = data.body.count;
            $scope.mtotalPages = Math.ceil($scope.mCount / $scope.mlimit);
          }
        })
      }
    });

    $scope.mpaginate = function(page) {
      if (page == 0 || $scope.mtotalPages < page)
        return false;

      $scope.mstart = page * $scope.mlimit - $scope.mlimit;
      $scope.mlimit = 10;
      $scope.mpage = page;
      serviceservice.getMaintenanceListSearch({
        key: session.get('keyvalue'),
        limit: $scope.mlimit,
        skip: $scope.mstart
      }, {}, function(data) {
        if (data.statusCode == 200) {
          $scope.maintenance = data.body.maintenance;
          $scope.mCount = data.body.count;
          $scope.mtotalPages = Math.ceil($scope.mCount / $scope.mlimit);
        }
      })
    }
    $scope.mrange = function() {
      var rangeSize = 5;
      var ret = [];
      var start;

      start = $scope.mpage;
      if (start > $scope.mtotalPages - rangeSize) {
        start = $scope.mtotalPages - rangeSize + 1;
      }

      for (var i = start; i < start + rangeSize; i++) {
        if (i > 0)
          ret.push(i);
      }
      return ret;
    };
    $scope.openPopUp = function(item){
      $scope.item = item;
      $('.modal').openModal();
    }

    $scope.deleteItem = function(id, index){
      console.log(id, index);
      serviceservice.deleteMaintenance({id:id}, {}, function(data){
        if(data.statusCode === 200){
          $scope.maintenance.splice(index, 1);
        }
        else{
          Materialize.toast(data.message, 3000);
        }
        console.log(data);
      })
    }

  })
  .controller('MaintenanceAddCtrl', function($scope, serviceservice) {
    $scope.maintenanceData = {};
    $scope.fromCatalog = "1";
    $scope.$on('$viewContentLoaded', function() {
      $('select').material_select();
    });
    $scope.selectThis = function(v) {
      $scope.maintenanceData.maintenance_id = v.maintenance_id;
      $scope.maintenanceData.maintenance_name = v.name;
      $scope.selectedService = v;
      $scope.maintenance_search = undefined;
      $scope.services = [];
    };
    $scope.removeThis = function() {
      $scope.maintenanceData.maintenance_id = undefined;
      $scope.selectedService = undefined;
      $scope.maintenance_search = undefined;
      $scope.services = [];
    };

    $scope.$watch('fromCatalog', function(value){
      if(value === "2"){
        $scope.services = [];
        $scope.removeThis();
      }
    })

    $scope.$watch('maintenance_search', function(value) {
      if($scope.fromCatalog === "1"){
        if (value && value != "") {
          serviceservice.getServiceList({
            name: value,
            skip: 0,
            limit: 10
          }, function(res) {
            $scope.services = [];
            $scope.services = res.body.services;
          })
        }
      }
      else{
        $scope.services = [];
      }
    });
    $scope.checkVin = function() {
      if (!$scope.maintenanceData.vin) {
        alert('please enter vin number');
        return false;
      }
      serviceservice.getVehicles({
          vin: $scope.maintenanceData.vin
        }, {},
        function(res) {
          var data = res.body;
          if (res.statusCode === 200) {
            if (data.count == 0) {
              Materialize.toast('<span>' + $scope.maintenanceData.vin + ' this vin not found</span>', 3000);
              $scope.maintenanceData.vin = '';
            } else {
              $scope.maintenanceData.vehicle_id = data.vehicle[0].vehicle_id;
            }
          }
          // Materialize.toast('<span>' + res.message + '</span>', 3000);
        })
    };

    $scope.addService = function() {
      console.log($scope.fromCatalog);
      console.log(!$scope.maintenanceData.maintenance_id);
      if($scope.fromCatalog === "1" && !$scope.maintenanceData.maintenance_id){
        alert('service id is required');
        return;
      }
      if($scope.fromCatalog === "2" && $scope.maintenanceData.maintenance_id){
        $scope.maintenanceData.maintenance_id = null;
        $scope.removeThis();
        return;
      }
      console.log($scope.maintenanceData);
      if ($scope.addServiceForms.$valid) {
        if (!$scope.maintenanceData.maintenance_id) alert('service id is requuired');
        serviceservice.saveRecommendMaintanance({},
          $scope.maintenanceData,
          function(res) {
            var data = res.body;
            if (res.statusCode === 200) {
              $scope.services = [];
              $scope.maintenanceData = {};

            }
            Materialize.toast('<span>' + res.message + '</span>', 3000);
          })
      }
    };
  })
