'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.userservice
 * @description
 * # userservice
 * Service in the dmsAdminApp.
 */
angular.module('dmsAdminApp').service('userservice', function($resource, session, endpoint) {
  return $resource('', null, {
    getUserList: {
      url: endpoint + '/admin/users?skip=:skip&limit=:limit',
      method: 'GET',
      params: {
        skip: "@skip",
        limit : "@limit"
      }
    },
    addUser: {
      url: endpoint + '/admin/users',
      method: 'POST',

    },
    deleteUser: {
      url: endpoint + '/admin/users/:id',
      method: 'DELETE',
      params: {
        id: "@id"
      }
    },
    getSingleUser: {
      url: endpoint + '/admin/users/:id',
      method: 'GET',
      params: {
        id: "@id"
      }
    },
    updateUser: {
      url: endpoint + '/admin/users/:id',
      method: 'PUT',
      params: {
        id: "@id"
      }
    },
    uploadUserFile: {
      url: endpoint + '/admin/users/upload',
      method: 'POST',
      headers: {
        "Content-Type": undefined
      }
    },
  })
});
