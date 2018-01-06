'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:UseraddCtrl
 * @description
 * # UseraddCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('UseraddCtrl', function ($scope, userservice) {

    $scope.userData = {};

    $scope.roles = [
      { name: "user", role: "User" },
      { name: "marketing_manager", role: "MM" },
      { name: "used_car_manager", role: "UCM" },
      { name: "service_scheduler", role: "SS" },
      { name: "service_adviser", role: "SA" },
      { name: "vehicle​_inspection​", role: "VI" }
    ];

    $scope.userData.roles =[];
    $scope.addUser = function(){
      if($scope.selectedroles.length==0){
        Materialize.toast('<span>Please select atleast one roles</span>', 3000);
        return false;
      }
      if($scope.userAddForm.$valid && $scope.userData.password === $scope.userData.cpassword){
        userservice.addUser({}, $scope.userData, function(data){
          if(data.statusCode === 200){
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
          else{
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
        })
      }
    }
    $scope.selectedroles = $scope.selectedroles || [];
    $scope.selectRoles = function (role) {
      if ($scope.selectedroles.indexOf(role) === -1) {
        $scope.selectedroles.push(role);
      } else {
        var posO = $scope.selectedroles.indexOf(role);
        $scope.selectedroles.splice(posO, 1)
      }
      console.log($scope.selectedroles)
    }
    $scope.uploadUserFile = function(files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);
  
      userservice.uploadUserFile({}, fd, function(data) {
        if (data.statusText == 'success') {
          if (data.body.already.length != 0) {
            var string ='';
            for(var i=0;i<data.body.already.length; i++){
              string = data.body.already[i].name  + ',' + string;
            }
            $scope.already = data.body.already;
  
          }
          var add = 0;
          for(var i=0;i<data.body.result.length; i++){
            if(data.body.result[i]!=null) add++;
          }
          Materialize.toast('<span>' + add   + " service added Successfully" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'Services adding has been failed' + '</span>', 3000);
        }
      })
    };
  });
