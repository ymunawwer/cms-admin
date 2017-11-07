'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:ListimagesCtrl
 * @description
 * # ListimagesCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('ListimagesCtrl', function ($scope, imageService) {

    imageService.getImage({}, {}, function(data){
      console.log(data);
      if(data.statusCode == 200){
        $scope.imageList = data.body.images;
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

  });
