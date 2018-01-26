'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:UserviewCtrl
 * @description
 * # UserviewCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('UserviewCtrl', function ($scope, userservice, $state, $timeout) {
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
    else {
      $scope.roles = "Users";
    }


    $scope.roles = [
      { name: "admin", role: "admin" },
      { name: "marketing_manager", role: "MM" },
      { name: "used_car_manager", role: "UCM" },
      { name: "service_scheduler", role: "SS" },
      { name: "service_adviser", role: "SA" },
      { name: "vehicle​_inspection​", role: "VI" }
    ];

    
    $scope.userList = [];
    $scope.ulimit = 10;
    $scope.ustart = 0;
    $scope.upage = 1;
    $scope.where['limit'] = $scope.ulimit
    $scope.where['skip'] = $scope.ustart
    $scope.getUsers = function () {
      userservice.getUserList($scope.where, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.userList = data.body.users;
          $scope.userCount = data.body.count;
          $scope.utotalPages = Math.ceil($scope.userCount / $scope.ulimit);
        }
      })
    }
    $scope.getUsers();
    $scope.userpaginate = function (page) {
      if (page == 0 || $scope.utotalPages < page)
        return false;

      $scope.ustart = page * $scope.ulimit - $scope.ulimit;
      $scope.ulimit = 10;
      $scope.upage = page;
      userservice.getUserList({
        limit: $scope.ulimit,
        skip: $scope.ustart
      }, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.userList = data.body.users;
          $scope.userCount = data.body.count;
          $scope.utotalPages = Math.ceil($scope.userCount / $scope.ulimit);
        }
      })
    }

    $scope.userdelete = function (id, index) {
      $scope.userId = id;
      $scope.userindex = index;
      $('#modal1').openModal({});
    }

    $scope.deleteUser = function () {
      userservice.deleteUser({
        id: $scope.userId
      }, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.getUsers();
          $('#modal1').closeModal({});
        }
      })
    }

    $scope.userrange = function () {
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

    $scope.close = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.alreadyu = null;
    }
    function updateTime() {
      $scope.close();
    }

    $scope.selectedroless = $scope.selectedroless || [];
    $scope.selectRoles = function (role) {

      if ($scope.selectedroless.indexOf(role) === -1) {
        $scope.selectedroless.push(role);
      } else {
        var posO = $scope.selectedroless.indexOf(role);
        $scope.selectedroless.splice(posO, 1)
      }
      console.log($scope.selectedroless)
    }
    $scope.totalusr = 1;
    $scope.adduserdiv = function () {
      $scope.totalusr = $scope.totalusr + 1;
    }
    $scope.removuserdiv = function ($index) {
      $scope.totalusr = $scope.totalusr - 1;
      $scope.userData.splice($index, 1);
    }
    $scope.checkRoles = [];
    $scope.checkBoxValid = function(role, id){
      // if ($scope.checkRoles+id.indexOf(role) === -1) {
      //   $scope.checkRoles+id.push(role);
      // } else {
      //   var posO = $scope.checkRoles+id.indexOf(role);
      //   $scope.checkRoles+id.splice(posO, 1)
      // }
      // console.log($scope.checkRoles+id)
    }

    // $scope.userData.roles =[];
    $scope.userData = [];
    $scope.addUser = function () {
     
      if ($scope.addUsersForm.$valid) {
        // console.log($scope.userData)
        // return false
        userservice.addBulkUser({}, $scope.userData, function (data) {
          if (data.statusCode === 200) {
            // $scope.userList = data.body.result ? $scope.userList.concat(data.body.result) : $scope.userList;
            $scope.getUsers();
            if (data.body.already.length != 0) {
              var string = '';
              for (var i = 0; i < data.body.already.length; i++) {
                string = data.body.already[i].name + ',' + string;
              }
              $scope.alreadyu = data.body.already;


            }
            var add = 0;
            for (var i = 0; i < data.body.result.length; i++) {
              if (data.body.result[i] != null) add++;
            }
            $scope.totalusr = 1;
            // $timeout(updateTime, 10000);
            angular.element(document.querySelector('#addUsersForm'))[0].reset();
            $scope.userData = [];
            Materialize.toast('<span>' + add + " Users have been uploaded successfully!" + '</span>', 3000);
          }
          else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      } else {
        Materialize.toast('<span> Add all fields</span>', 3000);
      }
    }

   
    $scope.uploadUserData = function (files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      userservice.uploadUserFile({}, fd, function (data) {
        if (data.statusText == 'success') {
          if (data.body.already.length != 0) {
            var string = '';
            for (var i = 0; i < data.body.already.length; i++) {
              string = data.body.already[i].name + ',' + string;
            }
            $scope.alreadyu = data.body.already;

          }
          $scope.getUsers();
          // $scope.userList = data.body.result ? $scope.userList.concat(data.body.result) : $scope.userList;
          var add = 0;
          for (var i = 0; i < data.body.result.length; i++) {
            if (data.body.result[i] != null) add++;
          }
          // $timeout(updateTime, 10000);
          angular.element(document.querySelector('#userUploadForm'))[0].reset();
          Materialize.toast('<span>' + add + " Users have been uploaded successfully!" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'User adding has been failed' + '</span>', 3000);
        }
      })
    };

    $scope.userEdit = function (user) {
      $scope.userData = user;
      $scope.selectedroless = $scope.userData.roles;
      $scope.roles.forEach(function(li, i) {
        if($scope.userData.roles.indexOf(li.name) !== -1){
          $scope.roles[i].status=true;
        }else{
          $scope.roles[i].status=false;
        }
      }); 
      $('#userEdit').openModal({});
    }
    $scope.updateUser = function() {
      if($scope.selectedroles.length==0){
        Materialize.toast('<span>Please select atleast one roles</span>', 3000);
        return false;
      }
      if ($scope.userAddForm.$valid) {
        $scope.userData.roles = $scope.selectedroless;
        userservice.updateUser({
          id: $scope.userData._id
        }, $scope.userData, function(data) {
          if (data.statusCode == 200) {
            $('#userEdit').closeModal({});
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }
    
  });
