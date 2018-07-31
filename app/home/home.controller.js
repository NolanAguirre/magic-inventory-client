angular
    .module('app')
    .controller('HomeController', homeController);

homeController.$inject = ['authService', 'httpService'];

function homeController(authService, httpService) {

    var vm = this;
    vm.auth = authService;
    vm.http = httpService;
    //vm.showProfile =  (profile) => {console.log(profile)}

}
