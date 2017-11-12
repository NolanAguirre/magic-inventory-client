angular
    .module('app')
    .directive('search', search);

function search() {
    return {
        templateUrl: 'app/pricing/search/search.html',
        controller: searchController,
        controllerAs: 'vm'
    }
}

searchController.$inject = ['CartService', '$scope'];

function searchController(cartService, $scope) {
    var vm = this;
    vm.cart = cartService;
    vm.isAdvancedSearch = false;
    
}
