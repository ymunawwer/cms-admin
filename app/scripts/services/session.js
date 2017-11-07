'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.session
 * @description
 * # session
 * Service in the dmsAdminApp.
 */
angular.module('dmsAdminApp')
.service('session', function($cookieStore) {
  return {
    set: function(key, value) {
      return $cookieStore.put(key, value);
    },
    get: function(key) {
      return $cookieStore.get(key);
    },
    destroy: function(key) {
      return $cookieStore.remove(key);
    }
  };
});
