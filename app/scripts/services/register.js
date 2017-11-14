'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.register
 * @description
 * # register
 * Factory in the dmsAdminApp.
 */
angular.module('dmsAdminApp')
  .factory('register', function($resource, endpoint) {
    return $resource('', null, {
      saveDealar: {
        url: endpoint + '/admin/register',
        method: 'POST'
      }
    })
  });
