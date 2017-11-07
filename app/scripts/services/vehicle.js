'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.vehicle
 * @description
 * # vehicle
 * Factory in the dmsAdminApp.
 */
 angular.module('dmsAdminApp').service('vehicleservice', function($resource, session, endpoint) {
   return $resource('', null, {
     getVehicleList: {
       url: endpoint + '/admin/vehicles?skip=:skip&limit=:limit',
       method: 'GET',
       params: {
         skip: "@skip",
         limit : "@limit"
       }
     },
     deleteVehicle: {
       url: endpoint + '/admin/vehicles/:id',
       method: 'DELETE',
       params: {
         id: "@id"
       }
     },
     deleteVehicles: {
       url: endpoint + '/admin/vehicles/removeall',
       method: 'DELETE'
     },
     viewSingleVehicle: {
       url: endpoint + '/admin/vehicles/:id',
       method: 'GET',
       params: {
         id: "@id"
       }
     },
     getLease: {
       url: endpoint + '/admin/vehicles/leaseexpiry',
       method: 'GET'
     },
     addLease: {
       url: endpoint + '/admin/vehicles/leaseexpiry',
       method: 'POST'
     },
     removeLease: {
       url: endpoint + '/admin/vehicles/leaseexpiry/remove',
       method: 'GET'
     },
     getLeaseSearch: {
       url: endpoint + '/admin/vehicles/leaseexpiry/search',
       method: 'GET'
     },
     uploadServiceFileLease: {
       url: endpoint + '/admin/vehicles/leaseexpiry/upload',
       method: 'POST',
       headers: {
         "Content-Type": undefined
       }
     }
   })
 });
