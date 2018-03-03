(function () {

  'use strict';

  angular
    .module('app', ['auth0.auth0', 'angular-jwt', 'ui.router', 'ui.bootstrap'])
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'angularAuth0Provider',
    'jwtOptionsProvider'
  ];

  function config(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider,
    $httpProvider,
    angularAuth0Provider,
    jwtOptionsProvider
  ) {
      $stateProvider
          .state('home', {
              url: '/',
              controller: 'HomeController',
              templateUrl: 'app/home/home.html',
              controllerAs: 'vm'
          }).state('search', {
              url: '/search',
              controller: 'PricingController',
              templateUrl: 'app/pricing/pricing.html',
              controllerAs: 'vm',
              resolve: {
                 authenticate: authenticateAdmin
              }
          }).state('inventory', {
              url: '/inventory',
              controller: 'InventoryController',
              templateUrl: 'app/inventory/inventory.html',
              controllerAs: 'vm',
              resolve: {
                  authenticate: authenticateAdmin
              }
          }).state('orders', {
              url: '/orders',
              controller: 'OrdersController',
              templateUrl: 'app/orders/orders.html',
              controllerAs: 'vm',
              resolve: {
                  authenticate: authenticateAdmin
              }
          }).state('settings', {
              url: '/settings',
              controller: 'SettingsController',
              templateUrl: 'app/settings/settings.html',
              controllerAs: 'vm',
              resolve: {
                  authenticate: authenticateAdmin
              }
          }).state('callback', {
              url: '/callback',
              controller: 'CallbackController',
              templateUrl: 'app/callback/callback.html',
              controllerAs: 'vm'
          });

      function authenticate($q, authService, $state, $timeout) {
          if (authService.isAuthenticated()) {
              return $q.when()
          } else {
              $timeout(function() {
                  $state.go('home')
              })
              return $q.reject()
          }
      }
      function authenticateAdmin($q, authService, $state, $timeout) {
          if (authService.isAuthenticated() && authService.isAdmin()) {
              return $q.when()
          } else {
              $timeout(function() {
                  $state.go('home')
              })
              return $q.reject()
          }
      }
      function checkAuthentication($transition$) {
        var $state = $transition$.router.stateService;
        var auth = $transition$.injector().get('authService');
        if (!auth.isAuthenticated()) {
          return $state.target('home');
        }
      }

      function checkForScopes(scopes) {
        return function checkAuthentication($transition$) {
          var $state = $transition$.router.stateService;
          var auth = $transition$.injector().get('authService');
          if (!auth.isAuthenticated() || !auth.userHasScopes(scopes)) {
            return $state.target('home');
          }
        }
      }
    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: 'token id_token',
      audience: AUTH0_AUDIENCE,
      redirectUri: AUTH0_CALLBACK_URL,
      scope: REQUESTED_SCOPES
    });

    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('access_token');
      },
      whiteListedDomains: ['localhost']
    });

    $httpProvider.interceptors.push('jwtInterceptor');

    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    // Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);

  }

})();
