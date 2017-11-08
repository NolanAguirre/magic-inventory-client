  angular
    .module('app', ['ui.router'])
    .config(config);

  config.$inject = [
    '$locationProvider',
    '$urlRouterProvider'
  ];

  function config(
    $locationProvider,
    $urlRouterProvider
  ) {

    $urlRouterProvider.otherwise('/');

    $locationProvider.hashPrefix('');

    /// Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)
    $locationProvider.html5Mode(true);
  }
