  angular
      .module('app', ['auth0.auth0', 'angular-jwt', 'ui.router'])
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
      $locationProvider,
      $urlRouterProvider,
      $httpProvider,
      angularAuth0Provider,
      jwtOptionsProvider
  ) {

      // Initialization for the angular-auth0 library
      angularAuth0Provider.init({
          clientID: AUTH0_CLIENT_ID,
          domain: AUTH0_DOMAIN,
          responseType: 'token id_token',
          audience: AUTH0_AUDIENCE,
          redirect: false,
          scope: 'openid profile read:messages'
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
