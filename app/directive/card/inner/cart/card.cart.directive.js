(function() {

  'use strict';

  angular
    .module('app')
    .directive('innerCardCart', card);

  function card() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        innerCard: '=card'
      },
      templateUrl: 'app/directive/card/inner/cart/card.cart.html'
    };
  }

})();
