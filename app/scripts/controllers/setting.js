'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:SettingctrlCtrl
 * @description
 * # SettingctrlCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('SettingCtrl', function($scope, $state, session, settings, $http, endpoint) {

    settings.getSetting({}, {}, function(data) {
      $scope.settings = data.body.setting;
    });

    $scope.updateSetting = function() {

      settings.updateSetting({}, $scope.settings, function(data) {
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
    $scope.uploadFile = function(files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("site_logo", files[0]);
      fd.append("_id", $scope.settings._id);


      settings.updateImage({}, fd, function(data){
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
  })
