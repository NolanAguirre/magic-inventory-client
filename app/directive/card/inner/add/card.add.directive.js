(function() {

  'use strict';

  angular
    .module('app')
    .directive('add', card);

  function card() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        innerCard: '=card'
      },
      templateUrl: 'app/directive/card/inner/add/card.add.html'
    };
  }

})();
