'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.register
 * @description
 * # register
 * Factory in the dmsAdminApp.
 */
angular.module('dmsAdminApp')
  .factory('register', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
