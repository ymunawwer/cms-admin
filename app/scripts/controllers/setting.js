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
    $scope.isStarted = false;
    settings.getSetting({}, {}, function (data) {
      $scope.settings = data.body.setting;
    });
    $scope.$on('$viewContentLoaded', function () { $('ul.tabs').tabs(); });
    $scope.selectTab = function (id) { $('ul.tabs').tabs('select_tab', id); };
    $scope.redirectPage = function (page) { $state.go(page); };
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

      console.log($scope.settings);
      //  fd.append("site_logo", $scope.blob, $scope.fileName);
      $scope.settings.site_logo = $scope.settings.blob;

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

    $scope.myImage = '';
    $scope.myCroppedImage = '';
    $scope.cropType = "square";
    $scope.validImage = false;
    $scope.showCroppedImg = false;

    //Once the user uploads the image from file type input
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
          $scope.$apply(function ($scope) { $scope.myImage = evt.target.result; $scope.validImage = true; });
          angular.element('#image_type').css('display', 'none');
        };
        reader.readAsDataURL(file); $("#fileInput").val = '';
      } else {
        $scope.validImage = false; angular.element('#image_type').css('display', 'block');
      }
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    var mimeType = "image/jpeg"
    function urltoFile(url, filename, mimeType) {
      return (fetch(url).then(function (res) {
        return res.arrayBuffer();
      }).then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      }));
    }


    // function to crop the uploaded images
    $scope.crop = function () {
      if ($scope.validImage) {
        $scope.image_temp = $scope.myCroppedImage;

        var byteString = atob($scope.myCroppedImage.split(',')[1]);

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia], { type: 'image/png' });
        console.log(blob);
        blob.lastModifiedDate = new Date();
        blob.lastModifiedDate = new Date();
        $scope.settings.blob = blob;
        $scope.settings.fileName = "a.png";

        $scope.blobUrl = URL.createObjectURL(blob);
        $scope.showCroppedImg = true;

      } else {
        Materialize.toast('<span>' + "Upload valid image" + '</span>', 3000);
      }
    }
    //function to clear uploaded image
    $scope.clearImage = function () {
      $scope.showCroppedImg = false;
      $scope.myImage = null;
      $scope.validImage = false;
      $("#fileInput").val = '';
    }
  })
