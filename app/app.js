(function() {

    'use strict';

    angular
        .module('app', ['angular-jwt', 'ui.router', 'ui.bootstrap'])
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$locationProvider',
        '$urlRouterProvider',
        '$httpProvider',
        'jwtOptionsProvider'
    ];

    function config(
        $stateProvider,
        $locationProvider,
        $urlRouterProvider,
        $httpProvider,
        jwtOptionsProvider
    ) {
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeController',
                templateUrl: 'app/home/home.html',
                controllerAs: 'vm'
            }).state('test', {
                url: '/test',
                controller: 'TestController',
                templateUrl: 'app/test/test.html',
                controllerAs: 'vm'
            }).state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'app/login/login.html',
                controllerAs: 'vm'
            }).state('store', {
                url: '/store',
                controller: 'StoreController',
                templateUrl: 'app/user/store/store.user.html',
                controllerAs: 'vm'
            }).state('stores', {
                url: '/stores',
                controller: 'StoresController',
                templateUrl: 'app/user/stores/stores.user.html',
                controllerAs: 'vm'
            }).state('cart', {
                url: '/cart',
                controller: 'CartController',
                templateUrl: 'app/user/cart/cart.user.html',
                controllerAs: 'vm'
            }).state('sellwithus', {
                url: '/seller',
                controller: '',
                templateUrl: 'app//cart/cart.user.html',
                controllerAs: 'vm'
            }).state('adminUpdateInventory', {
                url: '/adminUpdateInventory',
                controller: 'AdminUpdateInventoryController',
                templateUrl: 'app/admin/inventory/updateInventory.admin.html',
                controllerAs: 'vm',
                resolve: {
                    authenticate: authenticateAdmin
                }
            }).state('adminAddInventory', {
                url: '/adminAddInventory',
                controller: 'AdminAddInventoryController',
                templateUrl: 'app/admin/inventory/addInventory.admin.html',
                controllerAs: 'vm',
                resolve: {
                    authenticate: authenticateAdmin
                }
            }).state('adminViewInventory', {
                url: '/adminViewInventory',
                controller: 'AdminViewInventoryController',
                templateUrl: 'app/admin/inventory/viewInventory.admin.html',
                controllerAs: 'vm',
                resolve: {
                    authenticate: authenticateAdmin
                }
            }).state('adminPricing', {
                url: '/adminPricing',
                controller: 'AdminPricingController',
                templateUrl: 'app/admin/pricing/pricing.admin.html',
                controllerAs: 'vm',
                resolve: {
                    authenticate: authenticateAdmin
                }
            }).state('adminOrders', {
                url: '/adminOrders',
                controller: 'AdminOrdersController',
                templateUrl: 'app/admin/orders/orders.admin.html',
                controllerAs: 'vm',
                resolve: {
                    authenticate: authenticateAdmin
                }
            }).state('adminSettings', {
                url: '/adminSettings',
                controller: 'AdminSettingsController',
                templateUrl: 'app/admin/settings/settings.admin.html',
                controllerAs: 'vm',
                resolve: {
                    authenticate: authenticateAdmin
                }
            }).state('adminLocalSale', {
                url: '/adminLocalSale',
                controller: 'AdminLocalSaleController',
                templateUrl: 'app/admin/localSale/localSale.admin.html',
                controllerAs: 'vm',
                resolve: {
                    authenticate: authenticateAdmin
                }
            }).state('admin.owner', {
                url: '/owner',
                abstract: true,
                templateUrl: '<ng-view />',
                resolve: {
                    authenticate: authenticateOwner
                }
            }).state('admin.owner.employees', {
                url: '/employees',
                controller: 'EmployeesController',
                templateUrl: 'app/admin/settings/employee.owner.html',
                controllerAs: 'vm'
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

        function authenticateOwner($q, authService, $state, $timeout) {
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
