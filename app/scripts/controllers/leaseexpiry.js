'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:LeaseexpiryCtrl
 * @description
 * # LeaseexpiryCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('LeaseexpiryCtrl', function($scope, vehicleservice, $state, session) {
    $scope.llimit = 10;
    $scope.where = {};
    $scope.lstart = 0;
    $scope.lpage = 1;
    $scope.where['limit'] = $scope.llimit
    $scope.where['skip'] = $scope.lstart
    vehicleservice.getLease($scope.where,{}, function(data) {
      if (data.statusCode === 200) {
        $scope.expiry = data.body.expiry;
        $scope.leaseCount = data.body.count;
        $scope.ltotalPages = Math.ceil($scope.leaseCount / $scope.llimit);
      } else {
        Materialize.toast('<span>' + data.message + '</span>', 3000);
      }
    })

    $scope.$watch('searchVin', function(newValue, oldValue) {
      $scope.llimit = 10;
      $scope.lstart = 0;
      $scope.lpage = 1;
      $scope.where['limit'] = $scope.llimit
      $scope.where['skip'] = $scope.lstart
      console.log(newValue);
      if (newValue == '') {
        session.destroy('keyvalue')
        vehicleservice.getLease($scope.where, {}, function(data) {
          if (data.statusCode == 200) {
            $scope.expiry = data.body.expiry;
            $scope.leaseCount = data.body.count;
            $scope.ltotalPages = Math.ceil($scope.leaseCount / $scope.llimit);
          }
        })
      }
      if (newValue && newValue.length >= 1) {
        session.set('keyvalue', newValue)
        vehicleservice.getLeaseSearch({
          limit: $scope.llimit,
          skip: $scope.lstart,
          vin: newValue,
        }, {}, function(data) {
          if (data.statusCode == 200) {
            $scope.expiry = data.body.expiry;
            $scope.leaseCount = data.body.count;
            $scope.ltotalPages = Math.ceil($scope.leaseCount / $scope.llimit);
          }
        })
      }
    });

    $scope.leasepaginate = function(page) {
      if (page == 0 || $scope.ltotalPages == page)
        return false;

      $scope.lstart = page * $scope.llimit - $scope.llimit;
      $scope.llimit = 10;
      $scope.lpage = page;
      vehicleservice.getLeaseSearch({
        vin: session.get('keyvalue'),
        limit: $scope.llimit,
        skip: $scope.lstart
      }, {}, function(data) {
        if (data.statusCode == 200) {
          $scope.expiry = data.body.expiry;
          $scope.leaseCount = data.body.count;
          $scope.ltotalPages = Math.ceil($scope.leaseCount / $scope.llimit);
        }
      })
    }
    $scope.addLease = function() {
      vehicleservice.addLease({}, $scope.recallData, function(data) {
        if (data.statusCode === 200) {
          Materialize.toast('<span>' + data.message + '</span>', 3000);
          $location.path('recall/view')
        } else {
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      })

    }
    $scope.recallData ={};
    $scope.checkVins = function() {
      if(!$scope.recallData.vin){
        alert('please enter vin number');
        return false;
      }
      vehicleservice.getVehicles({vin:$scope.recallData.vin},
        {},
        function(res) {
          var data = res.body;
          if (res.statusCode === 200) {
            if(data.count==0){
              Materialize.toast('<span>' +  $scope.recallData.vin  + ' this vin not found</span>', 3000);
              $scope.recallData.vin ='';
            }else {
              $scope.recallData.vehicle_id = data.vehicle[0].vehicle_id;
            }
          }
          // Materialize.toast('<span>' + res.message + '</span>', 3000);
        })
    };

    $scope.uploadFileLease = function(files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      vehicleservice.uploadServiceFileLease({}, fd, function(data) {
        if (data.statusText == 'success') {
          if (data.body.already.length != 0) {
            var string ='';
            for(var i=0;i<data.body.already.length; i++){
              string = data.body.already[i].name  + ',' + string;
            }
            $scope.already = data.body.already;
          }
          Materialize.toast('<span> Recall added Successfully </span>', 3000);
          $state.go('home.lease');
        } else {
          Materialize.toast('<span> Recall adding has been failed </span>', 3000);
        }
      })
    };
    $scope.leaserange = function() {
      var rangeSize = 5;
      var ret = [];
      var start;

      start = $scope.lpage;
      if (start > $scope.ltotalPages - rangeSize) {
        start = $scope.ltotalPages - rangeSize + 1;
      }

      for (var i = start; i < start + rangeSize; i++) {
        if (i > 0)
          ret.push(i);
      }
      return ret;
    };

  });
