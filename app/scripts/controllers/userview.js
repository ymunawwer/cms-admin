'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:UserviewCtrl
 * @description
 * # UserviewCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('UserviewCtrl', function ($scope, userservice, $state, $timeout, session) {
    $scope.currentUser = session.get('admin');
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
    var rolesLookup = {
      'marketing_manager': 'MM',
      'used_car_manager': 'UCM',
      'service_scheduler': 'SS',
      'service_adviser': 'SA',
      'vehicle​_inspection​': 'VI',
      'admin': 'ADMIN',
      'user': 'USER'
    };
    $scope.printRoles = function (roles) {

      var rolesArray = [];
      if (roles) {
        roles.forEach(function (item) {
          rolesArray.push(rolesLookup[item]);
        });
      }
      rolesArray = rolesArray.filter(function (item) { return item != null && item != undefined && item != false })
      return rolesArray.length === 0 ? 'N/A' : rolesArray.join(",");
    }
    $scope.userList = [];
    $scope.customerList = [];
    $scope.ulimit = 10;
    $scope.ustart = 0;
    $scope.upage = 1;
    $scope.where['limit'] = $scope.ulimit
    $scope.where['skip'] = $scope.ustart
    $scope.where['exclude_roles'] = 'user';
    $scope.getUsers = function () {
      userservice.getUserList($scope.where, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.userList = data.body.users;
          $scope.customerList = data.body.customers;
          $scope.customerCount = data.body.customerCount;
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
          $scope.customerList = data.body.customers;
          $scope.customerCount = data.body.customerCount;
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
    $scope.closeVinAlert = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.availableVinNum = null;
    }
    $scope.closeInvalidVinAlert = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.invalidVinNum = null;
    }
    function updateTime() {
      $scope.close();
    }
    $scope.selectRoles = function (role) {
      console.log("ROLE CHANGED = ", role)
      if ($scope.userData.roles.indexOf(role.name) === -1) {
        $scope.userData.roles.push(role.name);
      } else {
        var posO = $scope.userData.roles.indexOf(role.name);
        $scope.userData.roles.splice(posO, 1)
      }
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
    $scope.checkBoxValid = function (role, id) {
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
        var isRoles = [];
        $scope.userData.map(function (item) {
          if (item.vin) {
            return;
          } else if (item.roles == undefined) {
            isRoles.push(item);
          }
        });
        if (isRoles.length == 0) {
          userservice.addBulkUser({}, $scope.userData, function (data) {
            if (data.statusCode === 200) {
              isRoles = [];
              // $scope.userList = data.body.result ? $scope.userList.concat(data.body.result) : $scope.userList;
              $scope.getUsers();
              if (data.body.already.length != 0) {
                var string = '';
                for (var i = 0; i < data.body.already.length; i++) {
                  string = data.body.already[i].name + ',' + string;
                }
                $scope.alreadyu = data.body.already;
              }
              if (data.body.availableVin.length != 0) {
                var stringVin = '';
                for (var i = 0; i < data.body.availableVin.length; i++) {
                  stringVin = data.body.availableVin[i] + ',' + stringVin;
                }
                $scope.availableVinNum = data.body.availableVin;
              }
              if (data.body.invalidVinNumbers.length != 0) {
                var stringVin = '';
                for (var i = 0; i < data.body.invalidVinNumbers.length; i++) {
                  stringVin = data.body.invalidVinNumbers[i] + ',' + stringVin;
                }
                $scope.invalidVinNum = data.body.invalidVinNumbers;
              }
              var add = 0;
              for (var i = 0; i < data.body.result.length; i++) {
                if (data.body.result[i] != null) add++;
              }
              $scope.totalusr = 1;
              // $timeout(updateTime, 10000);
              angular.element(document.querySelector('#addUsersForm'))[0].reset();
              $scope.userData = [];
              if(data.body.isCustomer){
                Materialize.toast('<span>' + data.body.createdUsers.length + " Users and " + data.body.createdVehicles.length + " Vehicles have been uploaded successfully!" + '</span>', 3000);
              } else {
                Materialize.toast('<span>' + data.body.createdUsers.length + " Users have been uploaded successfully!" + '</span>', 3000);
              }
            }
            else {
              Materialize.toast('<span>' + data.message + '</span>', 3000);
            }
          })
        } else {
          Materialize.toast('<span> Please enter roles.</span>', 3000);
        }
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
          if (data.body.availableVin.length != 0) {
            var stringVin = '';
            for (var i = 0; i < data.body.availableVin.length; i++) {
              stringVin = data.body.availableVin[i] + ',' + stringVin;
            }
            $scope.availableVinNum = data.body.availableVin;
          }
          $scope.getUsers();
          // $scope.userList = data.body.result ? $scope.userList.concat(data.body.result) : $scope.userList;
          var add = 0;
          for (var i = 0; i < data.body.result.length; i++) {
            if (data.body.result[i] != null) add++;
          }
          // $timeout(updateTime, 10000);
          angular.element(document.querySelector('#userUploadForm'))[0].reset();
          Materialize.toast('<span>' + data.body.createdUsers.length + " Users and " + data.body.createdVehicles.length + " Vehicles have been uploaded successfully!" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'User adding has been failed' + '</span>', 3000);
        }
      })
    };
    var tempUser = {};
    $scope.userEdit = function (user) {
      $scope.userData = user;
      // angular.copy(user, tempUser);
      $scope.roles.forEach(function (li, i) {
        if ($scope.userData.roles.indexOf(li.name) !== -1) {
          $scope.roles[i].status = true;
        } else {
          $scope.roles[i].status = false;
        }
      });
      $('#userEdit').openModal({});
    }
    $scope.cancelEdit = function () {
      $scope.getUsers();
    }
    $scope.updateUser = function () {
      if ($scope.userData.roles.length == 0) {
        Materialize.toast('<span>Please select atleast one roles</span>', 3000);
        return false;
      }
      if ($scope.userAddForm.$valid) {
        // $scope.userData.roles = $scope.selectedroless;
        userservice.updateUser({
          id: $scope.userData._id
        }, $scope.userData, function (data) {
          if (data.statusCode == 200) {
            $scope.userData = data.body.user;
            tempUser = {};
            $('#userEdit').closeModal({});
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }

  });
