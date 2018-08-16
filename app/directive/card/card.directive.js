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
        card: '=info',
        method: "=behaviour"
      },
      templateUrl: 'app/directive/card/card.html'
    };
  }

})();
