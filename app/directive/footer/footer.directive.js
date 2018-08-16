(function() {

  'use strict';

  angular
    .module('app')
    .directive('footer', footer);

  function footer() {
    return {
      templateUrl: 'app/footer/footer.html'
    }
  }
})();
