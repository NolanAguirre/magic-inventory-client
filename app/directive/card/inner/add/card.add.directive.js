(function() {

  'use strict';

  angular
    .module('app')
    .directive('innercardadd', card);

  function card() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        card: '=card',
        buttonpress: '=buttonpress'
      },
      templateUrl: 'app/directive/card/inner/add/card.add.html'
    };
  }

})();
