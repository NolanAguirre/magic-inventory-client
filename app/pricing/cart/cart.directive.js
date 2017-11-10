angular
    .module('app')
    .directive('cart', cart);

function cart() {
    return {
        templateUrl: 'app/pricing/cart/cart.html',
        controller: cartController,
        controllerAs: 'vm'
    }
}

cartController.$inject = ['CartService', '$scope'];

function cartController(cartService, $scope) {
    var vm = this;
    vm.cart = cartService;
    var timer;
    vm.updateQuantity = function(card, isFoil, quantity) {
        clearTimeout(timer);
        timer = setTimeout(function() {
            if(isFoil){
                card.quantityInCart.foil = quantity;
            }else{
                card.quantityInCart.regular = quantity;
            }
            vm.cart.updatePrice();
            $scope.$apply();
            console.log(vm.cart.total);
        }, 300);
    }
}
