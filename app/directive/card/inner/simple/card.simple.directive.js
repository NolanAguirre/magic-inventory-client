(function() {

  'use strict';

  angular
    .module('app')
    .directive('innercardsimple', card);

  function card() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        card: '=card'
      },
      templateUrl: 'app/directive/card/inner/simple/card.simple.html'
    };
  }

})();
