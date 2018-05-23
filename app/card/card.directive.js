(function() {

  'use strict';

  angular
    .module('app')
    .directive('card', card);
    
  function() {
    return {
      restrict: 'E',
      scope: {
        cardInfo: '=info'
      },
      templateUrl: 'app/card/card.html'
    };
  }

})();
