angular
    .module('app')
    .controller('CartController', cartController);


cartController.$inject = ['CartService'];

function cartController(cart) {
    var vm = this;
    vm.cart = cart;
    vm.cartItems = cart.getItems();
}
