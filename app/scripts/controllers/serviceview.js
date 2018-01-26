'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:ServiceviewCtrl
 * @description
 * # ServiceviewCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('ServiceviewCtrl', function ($scope, serviceservice, $timeout) {

    $scope.serviceList = [];
    $scope.servicelimit = 10;
    $scope.servicestart = 0;
    $scope.servicepage = 1;

    $scope.getService = function () {
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
    $scope.getService() 

    $scope.serviceDeleteAlert = function (id, index) {
      $scope.serviceId = id;
      $scope.serviceindex = index;
      $('#modal1').openModal({});
    }
   
    $scope.servicedelete = function () {
      serviceservice.deleteService({ id: $scope.serviceId }, {}, function (data) { if (data.statusCode == 200) { $scope.getService()
        $('#modal1').closeModal({}); } })
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

    $scope.close = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.alreadyu = null;
    }
    function updateTime() {
      $scope.close();
    }

    $scope.totalserve = 1;
    $scope.addservicediv = function () {
      $scope.totalserve = $scope.totalserve + 1;
    }
    $scope.removeservicediv = function ($index) {
      $scope.totalserve = $scope.totalserve - 1;
      $scope.serviceData.splice($index, 1);
    }
    $scope.serviceData = [];
    $scope.addService = function (continueStep) {
      if ($scope.addServiceForm.$valid) {
        $scope.serviceData.make = $scope.serviceData.make && $scope.serviceData.make.name != 'INDEPENDENT' ? $scope.serviceData.make.name : null;

        serviceservice.addBulkService({}, $scope.serviceData, function (data) {
          if (data.statusCode === 200) {
            // $scope.serviceList = data.body.result ? $scope.serviceList.concat(data.body.result): $scope.serviceList;
            $scope.getService()
            if (data.body.already.length != 0) {
              var string = '';
              for (var i = 0; i < data.body.already.length; i++) {
                string = data.body.already[i].name + ',' + string;
              }
              $scope.already = data.body.already;

            }
            var add = 0;
            for (var i = 0; i < data.body.result.length; i++) {
              if (data.body.result[i] != null) add++;
            }
            $scope.totalserve = 1;
            $timeout(updateTime, 10000);
            angular.element(document.querySelector('#formValidates'))[0].reset();
            $scope.serviceData = [];
            Materialize.toast('<span>' + add + " Service items have been uploaded successfully!" + '</span>', 3000);
            if (continueStep) $scope.nextStep($scope.inCompletedStep);
          } else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }

    $scope.uploadServiceData = function (files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      serviceservice.uploadServiceFile({}, fd, function (data) {
        if (data.statusText == 'success') {
          if (data.body.already.length != 0) {
            var string = '';
            for (var i = 0; i < data.body.already.length; i++) {
              string = data.body.already[i].name + ',' + string;
            }
            $scope.already = data.body.already;

          }
          $scope.getService()
          // $scope.serviceList = data.body.result ? $scope.serviceList.concat(data.body.result): $scope.serviceList;
          var add = 0;
          for (var i = 0; i < data.body.result.length; i++) {
            if (data.body.result[i] != null) add++;
          }
          $timeout(updateTime, 10000);
          angular.element(document.querySelector('#serviceUploadForm'))[0].reset();
          Materialize.toast('<span>' + add + " Service items have been uploaded successfully!" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'Services adding has been failed' + '</span>', 3000);
        }
      })
    };

    $scope.serviceEdit = function (service) {
      $scope.serviceData = service;
      $('#modalEdit').openModal({});
    }
    $scope.updateService = function(){
      if($scope.editServiceForm.$valid){
        $scope.serviceData.amount = $scope.serviceData.price;
        // $scope.serviceData.make = $scope.serviceData.make && $scope.serviceData.make.name;
        serviceservice.updateService({id: $scope.serviceData._id}, $scope.serviceData, function(data){
          if(data.statusCode == 200){
            $('#modalEdit').closeModal({});
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
          else{
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
        })
      }
    }
  });
