  angular
    .module('app')
    .directive('navbar', navbar);

  function navbar() {
    return {
      templateUrl: 'app/navbar/navbar.html',
      controller: navbarController,
      controllerAs: 'vm'
    }
  }

  navbarController.$inject = [];

  function navbarController() {
    var vm = this;
  }
