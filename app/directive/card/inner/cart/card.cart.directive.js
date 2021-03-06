(function() {

  'use strict';

  angular
    .module('app')
    .directive('innercardcart', card);

  function card() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        card: '=card',
        buttonpress: '=buttonpress'
      },
      templateUrl: 'app/directive/card/inner/cart/card.cart.html'
    };
  }

})();
