'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.authservice
 * @description
 * # authservice
 * Service in the dmsAdminApp.
 */
angular.module('dmsAdminApp')
  .service('authservice', function ($resource, endpoint) {
    return $resource('', null,
    {
      login:{
        url : endpoint+'/admin/login',
        method: 'POST'
      },
      forgetPassword:{
        url : endpoint+'/admin/forgot/password',
        method: 'POST',
      },
      resetPassword:{
        url : endpoint+'/admin/reset/password',
        method: 'POST',
      }
    })
  });
