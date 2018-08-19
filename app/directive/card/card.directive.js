(function() {

  'use strict';

  angular
    .module('app')
    .directive('card', card);

  function card() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        card: '=card'
      },
      templateUrl: 'app/directive/card/card.html'
    };
  }

})();
