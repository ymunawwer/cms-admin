'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:SettingctrlCtrl
 * @description
 * # SettingctrlCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('SettingCtrl', function ($scope, $state, session, settings, $http, endpoint, profileservice, serviceservice, userservice, imageService) {
    $scope.isStarted = false;
    $scope.settings = {};
    $scope.settings.primary_contact = {};
    $scope.settings.secondary_contact = {};
    $scope.settings.invoice_contact = {};
    $scope.settings.contact_to_show_customer = {};
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
      if ($scope.formValidate.$valid) {
        profileservice.updateProfile({}, $scope.profileData, function (data) {
          $scope.profileData = data.body.user;
          $scope.settings.site_title = $scope.profileData.name;
          settings.updateSetting({}, $scope.settings, function (data) {
            if (data.statusText == 'success') {
              $scope.site.site_title = $scope.settings.site_title;
              var message = data.message;
              $scope.isStarted = true;
              $scope.complete = 1;
              $scope.step = 2;
              // Materialize.toast('<span>' + message + '</span>', 3000);
            } else {
              var message = data.statusMessage;
              Materialize.toast('<span>' + message + '</span>', 3000);
            }
          });
        });
      }
    }
    $scope.updateSetting1 = function () {
      if ($scope.formValidate1.$valid) {

        settings.updateSetting({}, $scope.settings, function (data) {
          if (data.statusText == 'success') {
            $scope.site.site_title = $scope.settings.site_title;
            var message = data.message;
            $scope.isStarted = true;
            $scope.complete = 2;
            $scope.step = 3;
            // Materialize.toast('<span>' + message + '</span>', 3000);
          } else {
            var message = data.statusMessage;
            Materialize.toast('<span>' + message + '</span>', 3000);
          }
        });
      }
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

    $scope.close = function () {
      $scope.already = null;
    }
    $scope.uploadServiceData = function (files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      serviceservice.uploadServiceFile({}, fd, function (data) {
        if (data.statusText == 'success') {
          if (data.body.already.length != 0) {
            var string = '';
            for (var i = 0; i < data.body.already.length; i++) {
              string = data.body.already[i].name + ',' + string;
            }
            $scope.already = data.body.already;

          }
          var add = 0;
          for (var i = 0; i < data.body.result.length; i++) {
            if (data.body.result[i] != null) add++;
          }
          Materialize.toast('<span>' + add + " service added Successfully" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'Services adding has been failed' + '</span>', 3000);
        }
      })
    };

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
            $scope.already = data.body.already;

          }
          // var add = 0;
          // for(var i=0;i<data.body.result.length; i++){
          //   if(data.body.result[i]!=null) add++;
          // }
          Materialize.toast('<span> User added Successfully" </span>', 3000);
        } else {
          Materialize.toast('<span>' + 'User adding has been failed' + '</span>', 3000);
        }
      })
    };
    $scope.nextStep = function (stage) {
      $scope.isStarted = true;
      $scope.step = stage;
      $scope.complete = stage-1;
    }

    imageService.getImage({}, {}, function(data){
      console.log(data);
      if(data.statusCode == 200){
        $scope.imageList = data.body.images;
        if($scope.imageList.length==0)
        $scope.addImg = true;
        else
        $scope.viewImg = true;
      }
    })

    $scope.deleteRemove = function(id, index){
      console.log(id, index);
      imageService.deleteImage({id:id}, {}, function(data){
        if(data.statusCode === 200){
          $scope.imageList.splice(index, 1);
        }
        else{
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      })
    }

    $scope.myImage = '';
    $scope.myCroppedImage = '';
    $scope.cropType = "square";
    $scope.validImage = false;
    $scope.showCroppedImg = false;

    var handleFileSelect = function(evt) {
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

        reader.onload = function(evt) {
          $scope.$apply(function($scope) {
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

    var mimeType = "image/jpeg"

    function urltoFile(url, filename, mimeType) {
      return (fetch(url).then(function(res) {
        return res.arrayBuffer();
      }).then(function(buf) {
        return new File([buf], filename, {type: mimeType});
      }));
    }

    $scope.crop = function() {
      if ($scope.validImage) {
        $scope.image_temp = $scope.myCroppedImage;

        var byteString = atob($scope.myCroppedImage.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia], {type: 'image/png'});

        blob.lastModifiedDate = new Date();
        blob.lastModifiedDate = new Date();
        $scope.blob = blob;
        $scope.fileName = "a.png";

        $scope.blobUrl = URL.createObjectURL(blob);

        $scope.showCroppedImg = true;

      } else {
        Materialize.toast('<span>' +
          "Upload valid image" +
          '</span>',
        3000);
      }
    }

    $scope.clearImage = function() {
      $scope.showCroppedImg = false;
      $scope.myImage = null;
      $scope.validImage = false;
      $("#fileInput").val = '';
    }

    $scope.addImages = function(){
      if($scope.validImage){
        if($scope.showCroppedImg){
          var fd = new FormData();
          fd.append("picture", $scope.blob, $scope.fileName);
          fd.append("for", 'offer');

          imageService.uploadImage({},fd, function(data){
            if(data.statusCode === 200){
              Materialize.toast('<span>' + data.message + '</span>', 3000);
              $state.go('home.list-image');
            }
            else{
              Materialize.toast('<span>' + data.message + '</span>', 3000);
            }
          })
        }
        else{
          Materialize.toast('<span>' + "Crop image" + '</span>', 3000);
        }
      }
      else{
        Materialize.toast('<span>' + "Add a valid image" + '</span>', 3000);
      }
    }
    $scope.viewImage = function(){
      $scope.viewImg = true;
      $scope.addImg= false;
    }
    $scope.addImage = function(){
      $scope.viewImg = false;
      $scope.addImg= true;
    }
  });

