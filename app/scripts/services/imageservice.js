'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.imageService
 * @description
 * # imageService
 * Service in the dmsAdminApp.
 */
angular.module('dmsAdminApp').service('imageService', function($resource, endpoint) {
  return $resource('', null, {
    uploadImage: {
      url: endpoint + '/admin/images',
      method: 'POST',
      headers: {
        "Content-Type": undefined
      }
    },
    getImage: {
      url: endpoint + '/admin/images',
      method: 'GET',
    },
    deleteImage: {
      url: endpoint + '/admin/images/:id',
      method: 'DELETE',
      params: {
        id: "@id"
      }
    }
  })
});
