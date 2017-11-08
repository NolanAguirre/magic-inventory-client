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

cartController.$inject = [];

function cartController() {
  var vm = this;
}
