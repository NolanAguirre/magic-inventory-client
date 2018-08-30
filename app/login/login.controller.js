angular
    .module('app')
    .controller('LoginController', loginController);

loginController.$inject = ['authService'];

function loginController(auth){
    var vm = this;
    vm.auth = auth;
}
