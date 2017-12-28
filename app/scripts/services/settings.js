'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.settings
 * @description
 * # settings
 * Factory in the dmsAdminApp.
 */
angular.module('dmsAdminApp')
  .factory('settings', function ($resource, endpoint, session) {
    return $resource('', null, {
      getSetting: {
        url: endpoint + '/admin/settings',
        method: 'GET'
      },
      updateSetting: {
        url: endpoint + '/admin/settings',
        method: 'PUT'
      },
      updateImage: {
        url: endpoint + '/admin/settings',
        method: 'PUT',
        headers: {
          "Content-Type": undefined
        }
      },
      getAutoCheck: {
        url: endpoint + '/autocheck',
        method: 'GET'
      },
    })
  });
