'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('RegisterCtrl', function ($scope, $state, session, register, serviceservice, planService) {
    $scope.userData = {
      platform: "web"
    };
    $scope.pricingTable = null;
    $scope.plans = [];
    planService.getPlans({}, {}, function (data) {
      if (data.statusCode == 200) {
        $scope.plans = data.body.Plan;
      };
    });
    $scope.choosThisPlan = function(id) {
      $scope.pricingTable = $scope.userData.plan = id;
    };
    $scope.close = function () {
      $scope.error = '';
      $scope.success = '';
    }
    serviceservice.getMakesList({}, {}, function (data) {
      if (data.statusCode == 200) {
        $scope.makesList = data.body.makes;
      }
    });
    $scope.form = {};
    $scope.saveDealar = function () {
      if($scope.userData.password !== $scope.userData.cpassword) {
        Materialize.toast('<span>' + "Password should match with confirm password." + '</span>', 3000);
        return;
      }
      if ($scope.form.theForm.$valid) {
        register.saveDealar({}, $scope.userData, function (data) {
          if(data.statusCode === 200){
            session.set('accesstoken', data.body.accesstoken);
            session.set('admin', data.body);
            $state.go('home.dashboard');
            Materialize.toast('<span>' + "Successfully register dealer information " + '</span>', 3000);
          }
          else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }
  });
