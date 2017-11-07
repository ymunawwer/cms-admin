'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.profileservice
 * @description
 * # profileservice
 * Service in the dmsAdminApp.
 */
angular.module('dmsAdminApp')
  .service('profileservice', function ($resource, endpoint) {
    return $resource('', null, {
      getProfileData: {
        url: endpoint + '/admin/profile',
        method: 'GET'
      },
      updateProfile: {
        url: endpoint + '/admin/profile',
        method: 'put'
      },
      changePassword: {
        url: endpoint + '/admin/profile/change/password',
        method: 'post'
      }
    })
  });
