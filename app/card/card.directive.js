(function() {

  'use strict';

  angular
    .module('app')
    .directive('card', card);

  function card() {
    return {
      restrict: 'E',
      scope: {
        cardInfo: '=info'
      },
      templateUrl: 'app/card/card.html'
    };
  }

})();
