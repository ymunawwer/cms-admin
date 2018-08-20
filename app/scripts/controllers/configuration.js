'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:Configuration
 * @description
 * # ConfigurationCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('ConfigurationCtrl', function ($scope, $state, session, settings, serviceservice, profileservice) {
    $scope.isStarted = false;
    $scope.logout = function () { alert();session.destroy('accesstoken'); $state.go('login')};


    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    $scope.settings = {};
    $scope.settings.primary_contact = {};
    $scope.settings.secondary_contact = {};
    $scope.settings.invoice_contact = {};
    $scope.settings.contact_to_show_customer = {};
    $scope.settings.days_of_service = {};
    serviceservice.getManufactureList({}, {}, function (data) {
      if (data.statusCode == 200) {
        $scope.manufactureList = data.body.manufacture;
      }
    });
    $scope.changeManufacture = function () {
      console.log($scope.settings.manufactur)
      serviceservice.getMakesList({ id: $scope.settings.manufactur }, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.makesList = data.body.makes;
        }
      });
    }

    $scope.profileData = {};

    profileservice.getProfileData({}, {}, function (data) {
      if (data.statusCode === 200) {
        $scope.profileData = data.body.user;
      }
    });
    settings.getSetting({}, {}, function (data) {
      $scope.settings = data.body.setting || {};
      $scope.man = $scope.settings.manufactur;
      if ($scope.settings.finish_status == true) {
        $scope.isStarted = true;
        $scope.step = 1;
        $scope.complete = 1 - 1;
      }
      $scope.selectmake = $scope.settings.make;
      $scope.settings.holidays = $scope.settings.holidays && $scope.settings.holidays.filter(onlyUnique);
      if ($scope.settings.manufactur) {
        serviceservice.getMakesList({ id: $scope.settings.manufactur }, {}, function (data) {
          if (data.statusCode == 200) {
            $scope.makesList = data.body.makes;
          }
        });
      }
    });
    $scope.selectmake = $scope.selectmake || [];
   
     $scope.changeMake = function (make) {
       console.log(make)
       if ($scope.selectmake.indexOf(make._id) === -1) {
         $scope.selectmake.push(make._id);
       } else {
         var posO = $scope.selectmake.indexOf(make._id);
         $scope.selectmake.splice(posO, 1)
       }
       console.log($scope.selectmake)
     }
    $scope.updateSetting = function () {
      if ($scope.formValidate.$valid) {
        var tempPhone = $scope.profileData.phone;
        tempPhone = tempPhone.split("-").join("");
        if (isNaN(tempPhone) ||
          tempPhone.length !== 10) {
          Materialize.toast('<span> Please enter a valid phone no.</span>', 3000);
          return;
        }
        if ($scope.settings.manufactur !="5a3cbeb785b38502cad21b69") {
          if ($scope.selectmake.length == 0 ) {
            Materialize.toast('<span> Please select make.</span>', 3000);
            return;
          }
        }
        $scope.profileData.phone = tempPhone;
        $scope.profileData.manufactur = $scope.settings.manufactur;
        $scope.profileData.make = $scope.selectmake;
        $scope.settings.make = $scope.selectmake;

        profileservice.updateProfile({}, $scope.profileData, function (data) {
          $scope.profileData = data.body.user;
          $scope.settings.site_title = $scope.profileData.name;
          settings.updateSetting({}, $scope.settings, function (data) {
            if (data.statusText == 'success') {
              $scope.man = $scope.settings.manufactur;
              // $scope.site.site_title = $scope.settings.site_title;
              var message = data.message;
              Materialize.toast('<span> '+message+'</span>', 3000);
              $('html, body').animate({
                scrollTop: 0
              }, 'fast');
              // Materialize.toast('<span>' + message + '</span>', 3000);
            } else {
              var message = data.statusMessage;
              Materialize.toast('<span>' + message + '</span>', 3000);
            }
          });
        });
      }
      else {
        Materialize.toast('<span> Please enter all fields.</span>', 3000);
      }
    }
    $scope.primeToSecondary = function () {
      $scope.settings.secondary_contact = {};
      if ($scope.secondCheck) {
        $scope.settings.secondary_contact.name = $scope.settings.primary_contact.name;
        $scope.settings.secondary_contact.title = $scope.settings.primary_contact.title
        $scope.settings.secondary_contact.email = $scope.settings.primary_contact.email
        $scope.settings.secondary_contact.phone = $scope.settings.primary_contact.phone
      }
      else {
        $scope.settings.secondary_contact.name = $scope.settings.secondary_contact.name
        $scope.settings.secondary_contact.title = $scope.settings.secondary_contact.title
        $scope.settings.secondary_contact.email = $scope.settings.secondary_contact.email
        $scope.settings.secondary_contact.phone = $scope.settings.secondary_contact.phone
      }

    }
    $scope.primeToSecondary1 = function () {
      $scope.settings.contact_to_show_customer = {};
      if ($scope.secondCheck1) {
        $scope.settings.contact_to_show_customer.name = $scope.settings.secondary_contact.name;
        $scope.settings.contact_to_show_customer.address = $scope.settings.secondary_contact.address
        $scope.settings.contact_to_show_customer.email = $scope.settings.secondary_contact.email
        $scope.settings.contact_to_show_customer.phone = $scope.settings.secondary_contact.phone
        $scope.settings.contact_to_show_customer.website = $scope.settings.secondary_contact.website
      }
      else {
        $scope.settings.contact_to_show_customer.name = $scope.settings.contact_to_show_customer.name
        $scope.settings.contact_to_show_customer.address = $scope.settings.contact_to_show_customer.address
        $scope.settings.contact_to_show_customer.email = $scope.settings.contact_to_show_customer.email
        $scope.settings.contact_to_show_customer.phone = $scope.settings.contact_to_show_customer.phone;
        $scope.settings.contact_to_show_customer.website = $scope.settings.contact_to_show_customer.website
      }

    }
    $scope.$on('$viewContentLoaded', function () {
      $('ul.tabs').tabs();
      // $('.modal').modal();
      console.log('CONTENT LOADED')
    });
    $scope.selectTab = function (id) { $('ul.tabs').tabs('select_tab', id); };
    $scope.redirectPage = function (page) { $state.go(page); };

    // angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    $scope.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    var $picker = $('.datepickerholiday').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      min: true,
      close: 'Ok',
      closeOnSelect: true, // Close upon selecting a date,
      onSet: function (thingSet) {
        if (!thingSet.select) return;
        $scope.$apply(function () {
          var holidays = $scope.settings.holidays || [];
          holidays.push(thingSet.select);
          $scope.settings.holidays = holidays.filter(onlyUnique);
        })
      }
    });
    $scope.showCalender = function () { $picker.open(); };
    $scope.updateSetting1 = function () {
      if ($scope.formValidate1.$valid) {
        $scope.settings.holidays = $scope.settings.holidays && $scope.settings.holidays.length ?
          $scope.settings.holidays.filter(onlyUnique).map(function (item) { return new Date(item) }) : [];
        settings.updateSetting({}, $scope.settings, function (data) {
          if (data.statusText == 'success') {
            // $scope.site.site_title = $scope.settings.site_title;
            var message = data.message;
           
            Materialize.toast('<span>' + message + '</span>', 3000);
          } else {
            var message = data.statusMessage;
            Materialize.toast('<span>' + message + '</span>', 3000);
          }
        });
      } 
    }
  })