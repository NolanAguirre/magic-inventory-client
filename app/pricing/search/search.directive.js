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

searchController.$inject = ['CartSevice'];

function searchController(cartService) {
    var vm = this;
    var cart = cartService;
}
