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
   
    $scope.form = {};
    $scope.saveDealar = function () {
      if($scope.userData.password !== $scope.userData.cpassword) {
        Materialize.toast('<span>' + "Password should match with confirm password." + '</span>', 3000);
        return;
      }
      var tempPhone = $scope.userData.phone;
      tempPhone = tempPhone.split("-").join("");
      if (isNaN(tempPhone) ||
        tempPhone.length !== 10) {
        Materialize.toast('<span> Please enter a valid phone no.</span>', 3000);
        return;
      }
      $scope.userData.phone = tempPhone
      if ($scope.form.theForm.$valid) {
        let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z0-9]{1,})$/;
        if(!emailRegex.test($scope.userData.email)) {
          Materialize.toast('<span>' + "Please enter a valid email ID Ex: john.ws@anycompany.com" + '</span>', 3000);
          return;
        }
        register.saveDealar({}, $scope.userData, function (data) {
          if(data.statusCode === 200){
            // session.set('accesstoken', data.body.accesstoken);
            // session.set('admin', data.body);
            // $state.go('configuration');
            $scope.userData = {};
            Materialize.toast('<span>' + "We have sent you an email in the email ID you just used. Please click on the verification link on the email to verify your account." + '</span>', 3000);
          }
          else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }
  });
