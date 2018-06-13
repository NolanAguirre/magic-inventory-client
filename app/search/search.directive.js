(function() {

  'use strict';

  angular
    .module('app')
    .directive('search', search);

  function search() {
    return {
      restrict: 'E',
      scope: {
        search: '=info'
      },
      templateUrl: 'app/search/search.html'
    };
  }
})();
