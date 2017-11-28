'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.imageService
 * @description
 * # imageService
 * Service in the dmsAdminApp.
 */
angular.module('dmsAdminApp').service('planService', function($resource, endpoint) {
  return $resource('', null, {
    getPlans: {
      url: endpoint + '/plans',
      method: 'GET',
    }
  })
});
