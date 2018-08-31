'use strict';

/**
 * @ngdoc service
 * @name dmsAdminApp.serviceservice
 * @description
 * # serviceservice
 * Service in the dmsAdminApp.
 */
angular.module('dmsAdminApp')
  .service('serviceservice', function ($resource, session, endpoint) {
    return $resource('', null, {
      getServiceList: {
        url: endpoint + '/admin/services?skip=:skip&limit=:limit',
        method: 'GET',
        params: {
          skip: "@skip",
          limit : "@limit"
        }
      },
      addService: {
        url: endpoint + '/admin/services',
        method: 'POST',
      },
      addBulkService: {
        url: endpoint + '/admin/services/bulk',
        method: 'POST',
      },
      deleteService: {
        url: endpoint + '/admin/services/:id',
        method: 'DELETE',
        params: {
          id: "@id"
        }
      },
      getSingleService: {
        url: endpoint + '/admin/services/:id',
        method: 'GET',
        params: {
          id: "@id"
        }
      },
      updateService: {
        url: endpoint + '/admin/services/:id',
        method: 'PUT',
        params: {
          id: "@id"
        }
      },
      getVehicles: {
        url: endpoint + '/admin/vehicles',
        method: 'GET'
      },
      uploadServiceFile: {
        url: endpoint + '/admin/services/upload',
        method: 'POST',
        headers: {
          "Content-Type": undefined
        }
      },
      uploadServiceFileRecall: {
        url: endpoint + '/admin/recall',
        method: 'POST',
        headers: {
          "Content-Type": undefined
        }
      },
      uploadServiceFileRecallLookUp: {
        url: endpoint + '/admin/recall/lookup',
        method: 'POST',
        headers: {
          "Content-Type": undefined
        }
      },
      getMaintenanceList: {
        url: endpoint + '/admin/maintenance',
        method: 'GET'
      },
      saveRecommendMaintanance: {
        url: endpoint + '/admin/maintenance/recommend',
        method: 'POST'
      },

      getPreMaintenanceList: {
        url: endpoint + '/admin/maintenance/pre',
        method: 'GET'
      },
      importToMaintenance: {
        url: endpoint + '/admin/maintenance/copy',
        method: 'GET'
      },
      deleteMaintenance:{
        url: endpoint + '/admin/maintenance/:id',
        method: 'DELETE',
        params: {
          id: "@id"
        }
      },
      getRecall: {
        url: endpoint + '/admin/recall',
        method: 'GET'
      },
      addRecall: {
        url: endpoint + '/admin/recall',
        method: 'POST'
      },
      getRecallLookup: {
        url: endpoint + '/admin/recall/lookup',
        method: 'GET'
      },
      addRecallLookup: {
        url: endpoint + '/admin/recall/lookup',
        method: 'POST'
      },
      getMaintenanceListSearch: {
        url: endpoint + '/admin/maintenance/search',
        method: 'GET'
      },
      getRecallsSearch: {
        url: endpoint + '/admin/recall/search',
        method: 'GET'
      },
      getMakesList: {
        url: endpoint + '/admin/makes/manufacture/:id',
        method: 'GET',
        params: {
          id: "@id"
        }
      },
      getModelsLists: {
        url: endpoint + '/admin/models',
        method: 'GET'
      },
      deleteRecall: {
        url: endpoint + '/admin/recall/:id',
        method: 'DELETE',
        params: {
          id: "@id"
        }
      },
      getModelsList: {
        url: endpoint + '/admin/models/makes/:id',
        method: 'GET',
        params: {
          id: "@id"
        }
      },
      addMOfferLists: {
        url: endpoint + '/admin/offers/maintenanceitems',
        method: 'POST',
      }, 
      getMOfferLists: {
        url: endpoint + '/admin/offers/maintenanceitems',
        method: 'GET',
      },
      getSingleMOfferLists: {
        url: endpoint + '/admin/offers/maintenanceitems/:id',
        method: 'GET',
        params: {
          id: "@id"
        }
      },
      updateMOfferLists: {
        url: endpoint + '/admin/offers/maintenanceitems/:id',
        method: 'PUT',
        params: {
          id: "@id"
        }
      }, 
      getMileageList: {
        url: endpoint + '/admin/offers/maintenancemiles/:id',
        method: 'GET',
        params: {
          id: "@id"
        }
      }, 
      getManufactureList: {
        url: endpoint + '/admin/manufacturers',
        method: 'GET'
      },
      getMakesLists: {
        url: endpoint + '/admin/makes',
        method: 'GET'
      },
      getNewManufactureList: {
        url: endpoint + '/admin/manufacturers/newmanufacturers',
        method: 'GET'
      },
    })
  });
