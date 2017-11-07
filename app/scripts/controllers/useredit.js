'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:UsereditCtrl
 * @description
 * # UsereditCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp').controller('UsereditCtrl', function($scope, $stateParams, userservice) {

  var id = $stateParams.id;
  $scope.userData = {};

  userservice.getSingleUser({
    id: id
  }, {}, function(data) {
    if (data.statusCode == 200) {
      $scope.userData = data.body.user;
      // // console.log($scope.userData.roles);
      // // userData.roles = $scope.userData.roles
      // // $scope.userData.roles = ['admin','user'];
      // var test = $scope.userData.roles.join(',')
      // // console.log($scope.userData.roles);
      // $("#mySelect").material_select('update');
      // var newValuesArr = [],select = $("#mySelect"),ul = select.prev();
      // ul.children('li').toArray().forEach(function(li, i) {
      //   console.log(li,i);
      //   if (true && i> 0) {
      //     newValuesArr.push(select.children('option').toArray()[i].value);
      //   }
      // });
      // select.val(newValuesArr);
      // console.log(newValuesArr);
      $("select").material_select('update');
    }
  });

  $scope.addUser = function() {
    if ($scope.userAddForm.$valid) {
      userservice.updateUser({
        id: id
      }, $scope.userData, function(data) {
        if (data.statusCode == 200) {
          $scope.userData = data.body.user;
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      })
    }
  }
});
