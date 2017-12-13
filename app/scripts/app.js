'use strict';

/**
 * @ngdoc overview
 * @name dmsAdminApp
 * @description
 * # dmsAdminApp
 *
 * Main module of the application.
 */
angular.module('dmsAdminApp', ['ngCookies', 'ui.materialize', 'ui.router', 'ngCookies',
'ngResource', 'ngImgCrop'])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/')
    $stateProvider
      .state('home', {
        abstract: true,
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        authenticate: true
      })
      .state('home.dashboard', {
        url: '',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        authenticate: true
      })
      .state('home.useradd', {
        url: 'user/add',
        templateUrl: 'views/useradd.html',
        controller: 'UseraddCtrl',
        authenticate: true
      })
      .state('home.userview', {
        url: 'user/view',
        templateUrl: 'views/userview.html',
        controller: 'UserviewCtrl',
        authenticate: true
      })
      .state('home.userview.user', {
        url: 'user/view/user',
        templateUrl: 'views/userview.html',
        controller: 'UserviewCtrl',
        authenticate: true
      })
      .state('home.userview.marketingmanager', {
        url: 'user/view/marketing_manager',
        templateUrl: 'views/userview.html',
        controller: 'UserviewCtrl',
        authenticate: true
      })
      .state('home.userview.usercarmanager', {
        url: 'user/view/usercar_manager',
        templateUrl: 'views/userview.html',
        controller: 'UserviewCtrl',
        authenticate: true
      })
      .state('home.userview.serviceschedulers', {
        url: 'user/view/service_schedulers',
        templateUrl: 'views/userview.html',
        controller: 'UserviewCtrl',
        authenticate: true
      })
      .state('home.userview.serviceadviser', {
        url: 'user/view/service_adviser',
        templateUrl: 'views/userview.html',
        controller: 'UserviewCtrl',
        authenticate: true
      })
      .state('home.useredit', {
        url: 'user/edit/:id',
        templateUrl: 'views/useredit.html',
        controller: 'UsereditCtrl',
        authenticate: true
      })
      .state('home.serviceadd', {
        url: 'service/add',
        templateUrl: 'views/serviceadd.html',
        controller: 'ServiceaddCtrl',
        authenticate: true
      })
      .state('home.serviceview', {
        url: 'service/view',
        templateUrl: 'views/serviceview.html',
        controller: 'ServiceviewCtrl',
        authenticate: true
      })
      .state('home.maintenance', {
        url: 'maintenance',
        templateUrl: 'views/maintenance.html',
        controller: 'MaintenanceCtrl',
        authenticate: true
      })
      .state('home.premaintenance', {
        url: 'pre-maintenance',
        templateUrl: 'views/premaintenance.html',
        controller: 'PremaintenanceCtrl',
        authenticate: true
      })
      .state('home.maintenancepassword', {
        url: 'maintenance/password',
        templateUrl: 'views/maintenance_password.html',
        controller: 'MaintenancesecurityCtrl',
        authenticate: true
      })
      .state('home.maintenancekey', {
        url: 'maintenance/key',
        templateUrl: 'views/maintenance_key.html',
        controller: 'MaintenancesecurityCtrl',
        authenticate: true
      })
      .state('home.maintenancetoken', {
        url: 'maintenance/token',
        templateUrl: 'views/maintenance_token.html',
        controller: 'MaintenancesecurityCtrl',
        authenticate: true
      })
      .state('home.serviceedit', {
        url: 'service/edit/:id',
        templateUrl: 'views/serviceedit.html',
        controller: 'ServiceeditCtrl',
        authenticate: true
      })
      .state('home.profile', {
        url: 'user/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true
      })
      .state('home.recall', {
        url: 'recall',
        templateUrl: 'views/recall.html',
        controller: 'RecallCtrl',
        authenticate: true
      })
      .state('home.recallview', {
        url: 'recall/view',
        templateUrl: 'views/view-recall.html',
        controller: 'RecallCtrl',
        authenticate: true
      })
      .state('home.recallookup', {
        url: 'recall/lookup',
        templateUrl: 'views/recall_import.html',
        controller: 'RecallCtrl',
        authenticate: true
      })
      .state('home.settings', {
        url: 'settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingCtrl',
        authenticate: true
      })
      .state('home.vehicle', {
        url: 'vehicles',
        templateUrl: 'views/vehicle.html',
        controller: 'VehicleCtrl',
        authenticate: true
      })
      .state('home.lease', {
        url: 'leaseexpiry',
        templateUrl: 'views/viewlease.html',
        controller: 'LeaseexpiryCtrl',
        authenticate: true
      })
      .state('home.leaseadd', {
        url: 'leaseexpiry/add',
        templateUrl: 'views/addlease.html',
        controller: 'LeaseexpiryCtrl',
        authenticate: true
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .state('forget-password', {
        url: '/forget-password',
        templateUrl: 'views/forget-password.html',
        controller: 'LoginCtrl'
      })
      .state('reset-password', {
        url: '/reset-password',
        templateUrl: 'views/resetpassword.html',
        controller: 'LoginCtrl'
      })
      .state('home.maintenance_add', {
        url: 'maintenance/add',
        templateUrl: 'views/maintenance-add.html',
        controller: 'MaintenanceAddCtrl'
      })
      .state('home.add-image', {
        url: 'offer/image',
        templateUrl: 'views/offerImage.html',
        controller: 'OfferimageCtrl'
      })
      .state('home.list-image', {
        url: 'offer/image/list',
        templateUrl: 'views/listImages.html',
        controller: 'ListimagesCtrl'
      })
      .state('home.add-offer', {
        url: 'maintenance/offer/add',
        templateUrl: 'views/moffer_add.html',
        controller: 'MofferCtrl',
        authenticate: true
      })
      .state('home.list-offer', {
        url: 'maintenance/offer/list',
        templateUrl: 'views/moffer_view.html',
        controller: 'MofferCtrl',
        authenticate: true
      })
      .state('home.edit-offer', {
        url: 'maintenance/offer/edit/:id',
        templateUrl: 'views/moffer_edit.html',
        controller: 'MofferCtrl',
        authenticate: true
      })

  }  
])
.constant({
  "endpoint": "http://165.227.104.212:3000/api/v1"
  // "endpoint": "http://0.0.0.0:3000/api/v1"
})
.run(
  function($rootScope, $http, $state, $location, $templateCache, session) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $http.defaults.headers.common['Authorization'] = session.get('accesstoken');
    console.log(session.get('accesstoken'));
    if (toState.authenticate && !session.get('accesstoken')) {
      event.preventDefault();
      $state.go('login');
    }
    if (toState.controller == 'LoginCtrl' && session.get('accesstoken')) {
      event.preventDefault();
      $state.go('home.dashboard');
    }
  });
})
