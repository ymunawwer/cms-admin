'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:OfferimageCtrl
 * @description
 * # OfferimageCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('OfferimageCtrl', function ($scope, $state, imageService) {
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
  });
