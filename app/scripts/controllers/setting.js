'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:SettingctrlCtrl
 * @description
 * # SettingctrlCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('SettingCtrl', function ($scope, $state, session, settings, $http, endpoint, profileservice, serviceservice) {
    settings.getSetting({}, {}, function (data) {
      $scope.settings = data.body.setting;
    });
    $scope.$on('$viewContentLoaded', function () {
      $('ul.tabs').tabs();
    });
    $scope.selectTab = function (id) {
      $('ul.tabs').tabs('select_tab', id);
    };
    $scope.redirectPage = function (page) {
      $state.go(page);
    };
    $scope.settingsTimpicker = {
      dropdownToggleState: false,
      time: {
        fromHour: '05',
        fromMinute: '30',
        toHour: '10',
        toMinute: '10'
      },
      theme: 'dark',
      noRange: false,
      format: 24,
      noValidation: false
    };
    var handleFileSelect = function (evt) {
      var valu = evt.currentTarget.files[0].type;
      var patt = new RegExp("image/");
      if (patt.test(valu)) {
        angular.element('#img_cropper').children('canvas').css('display', 'block');
        $('#upload_block').css('display', 'none');
        $('.cropArea').css('display', 'block');
        $('.image_cropped').css('display', 'inline-block');
        angular.element('#image_type').css('display', 'none');

        var file = evt.currentTarget.files[0];
        var reader = new FileReader();

        var output = document.getElementById("result");

        reader.onload = function (evt) {
          $scope.$apply(function ($scope) {
            $scope.myImage = evt.target.result;
            $scope.validImage = true;
          });
          angular.element('#image_type').css('display', 'none');
        };
        reader.readAsDataURL(file);
        $("#fileInput").val = '';
      } else {
        $scope.validImage = false;
        angular.element('#image_type').css('display', 'block');
      }
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    $scope.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    $scope.updateSetting = function () {
      settings.updateSetting({}, $scope.settings, function (data) {
        if (data.statusText == 'success') {
          $scope.site.site_title = $scope.settings.site_title;
          var message = data.message;
          Materialize.toast('<span>' + message + '</span>', 3000);
        } else {
          var message = data.statusMessage;
          Materialize.toast('<span>' + message + '</span>', 3000);
        }
      });
    }
    serviceservice.getMakesList({}, {}, function (data) {
      if (data.statusCode == 200) {
        $scope.makesList = data.body.makes;
      }
    });
    $scope.uploadFile = function (files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("site_logo", files[0]);
      fd.append("_id", $scope.settings._id);
      settings.updateImage({}, fd, function (data) {
        if (data.statusText == 'success') {
          $scope.settings.site_logo.url = data.body.setting.site_logo.url;
          var message = data.message;
          Materialize.toast('<span>' + 'Image Uploaded Successfully' + '</span>', 3000);
        } else {
          var message = data.statusMessage;
          Materialize.toast('<span>' + 'Image Uploading failed!' + '</span>', 3000);
        }
      })
    };
    $scope.profileData = {};

    profileservice.getProfileData({}, {}, function (data) {
      if (data.statusCode === 200) {
        $scope.profileData = data.body.user;
      }
    });

    $scope.changePassword = function () {
      profileservice.changePassword({}, $scope.changepassword, function (data) {
        if (data.statusCode === 200) {
          $scope.changepassword.old_password = '';
          $scope.changepassword.password = '';
          $scope.changepassword.cpassword = '';
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
        else {
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      });
    }
    $scope.updateProfile = function () {
      profileservice.updateProfile({}, $scope.profileData, function (data) {
        if (data.statusCode === 200) {
          $scope.profileData = data.body.user;
          $scope.admin.name = $scope.profileData.name;
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      });
    }
  })
