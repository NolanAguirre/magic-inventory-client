(function() {

  'use strict';

  angular
    .module('app')
    .directive('card', card);

  function card() {
    return {
      restrict: 'E',
      scope: {
        card: '=info',
        method: "=behaviour"
      },
      templateUrl: 'app/card/card.html'
    };
  }

})();
