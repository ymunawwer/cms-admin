'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:ServiceeditCtrl
 * @description
 * # ServiceeditCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('ServiceeditCtrl', function ($scope, $stateParams, serviceservice) {
    var id = $stateParams.id;
    $scope.serviceData = {};
    serviceservice.getMakesList({},{}, function(data){
      if(data.statusCode == 200){
        $scope.makesList = data.body.makes;
      }
    })
    serviceservice.getModelsLists({
    },{}, function(data){
      if(data.statusCode == 200){
        $scope.modelsList = data.body.models;
      }
    })
    $scope.changeSelectMake = function(){
      console.log($scope.serviceData.make);
      serviceservice.getModelsList({
        id:$scope.serviceData.make._id
      },{}, function(data){
        if(data.statusCode == 200){
          $scope.modelsList = data.body.models;
        }
      })
    }
    serviceservice.getSingleService({id: id},{}, function(data){
      if(data.statusCode == 200){
        $scope.serviceData = data.body.service;
      }
    });

    $scope.updateUser = function(){
      if($scope.editServiceForm.$valid){
        $scope.serviceData.amount = $scope.serviceData.price;
        $scope.serviceData.make = $scope.serviceData.make.name;
        serviceservice.updateService({id: id}, $scope.serviceData, function(data){
          if(data.statusCode == 200){
            $scope.serviceData = data.body.service;
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
          else{
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
        })
      }
    }

  });
