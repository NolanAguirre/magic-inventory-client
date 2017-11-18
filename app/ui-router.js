angular
    .module('app', ['ui.router'])
    .config(config)

config.$inject = [
    '$stateProvider'
];

function config($stateProvider) {
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
            controllerAs: 'vm'
        }).state('inventory', {
            url: '/inventory',
            controller: 'InventoryController',
            templateUrl: 'app/inventory/inventory.html',
            controllerAs: 'vm'
        });
}
