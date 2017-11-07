'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:UserviewCtrl
 * @description
 * # UserviewCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('UserviewCtrl', function($scope, userservice, $state) {
    $scope.where = {};
    if ($state.current.name == "home.userview.user") {
      $scope.roles = "Users"
      $scope.where['roles'] = 'user';
    } else if ($state.current.name == "home.userview.serviceadviser") {
      $scope.roles = "Service Adviser"
      $scope.where['roles'] = 'service_adviser';
    } else if ($state.current.name == "home.userview.serviceschedulers") {
      $scope.roles = "Service Scheduler"
      $scope.where['roles'] = 'service_scheduler';
    } else if ($state.current.name == "home.userview.usercarmanager") {
      $scope.roles = "Used Car Manager"
      $scope.where['roles'] = 'used_car_manager';
    } else if ($state.current.name == "home.userview.marketingmanager") {
      $scope.roles = "Marketing Manager"
      $scope.where['roles'] = 'marketing_manager';
    }
    else{
      $scope.roles = "Users";
    }



    $scope.userList = [];
    $scope.ulimit = 10;
    $scope.ustart = 0;
    $scope.upage = 1;
    $scope.where['limit'] = $scope.ulimit
    $scope.where['skip'] = $scope.ustart
    userservice.getUserList($scope.where, {}, function(data) {
      if (data.statusCode == 200) {
        $scope.userList = data.body.users;
        $scope.userCount = data.body.count;
        $scope.utotalPages = Math.ceil($scope.userCount / $scope.ulimit);
      }
    })

    $scope.userpaginate = function(page) {
      if (page == 0 || $scope.utotalPages < page)
        return false;

      $scope.ustart = page * $scope.ulimit - $scope.ulimit;
      $scope.ulimit = 10;
      $scope.upage = page;
      userservice.getUserList({
        limit: $scope.ulimit,
        skip: $scope.ustart
      }, {}, function(data) {
        if (data.statusCode == 200) {
          $scope.userList = data.body.users;
          $scope.userCount = data.body.count;
          $scope.utotalPages = Math.ceil($scope.userCount / $scope.ulimit);
        }
      })
    }

    $scope.userdelete = function(id, index) {
        $scope.userId = id;
        $scope.userindex = index;
        $('.modal').openModal({});
    }

    $scope.deleteUser = function(){
      userservice.deleteUser({
        id: $scope.userId
      }, {}, function(data) {
        if (data.statusCode == 200) {
          $scope.userList.splice($scope.userindex, 1);
          $('.modal').closeModal({});
        }
      })
    }

    $scope.userrange = function() {
      var rangeSize = 5;
      var ret = [];
      var start;

      start = $scope.upage;
      if (start > $scope.utotalPages - rangeSize) {
        start = $scope.utotalPages - rangeSize + 1;
      }

      for (var i = start; i < start + rangeSize; i++) {
        if (i > 0)
          ret.push(i);
      }
      return ret;
    };

  });
