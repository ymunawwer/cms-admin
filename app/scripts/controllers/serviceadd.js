'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:ServiceaddCtrl
 * @description
 * # ServiceaddCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp').controller('ServiceaddCtrl', function ($scope, serviceservice, session) {
  $scope.serviceData = {};
  $scope.serviceData.make = session.get('admin').manufactur;
  serviceservice.getMakesList({}, {}, function (data) {
    if (data.statusCode == 200) {
      $scope.makesList = data.body.makes;
    }
  });
  $scope.changeSelectMake = function () {
    serviceservice.getModelsList({
      id: $scope.serviceData.make._id
    }, {}, function (data) {
      if (data.statusCode == 200) {
        $scope.modelsList = data.body.models;
      }
    })
  }

  $scope.addService = function () {
    if ($scope.addServiceForm.$valid) {
      $scope.serviceData.make = $scope.serviceData.make.name;
      serviceservice.addService({}, $scope.serviceData, function (data) {
        if (data.statusCode === 200) {
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      })
    }
  }
  $scope.close = function () {
    $scope.already = null;
  }
  $scope.uploadFile = function (files) {
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
        var add = 0;
        for (var i = 0; i < data.body.result.length; i++) {
          if (data.body.result[i] != null) add++;
        }
        Materialize.toast('<span>' + add + " service added Successfully" + '</span>', 3000);
      } else {
        Materialize.toast('<span>' + 'Services adding has been failed' + '</span>', 3000);
      }
    })
  };

});
