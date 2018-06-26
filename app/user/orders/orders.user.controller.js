angular
  .module('app')
  .controller('OrdersController', ordersController);


ordersController.$inject = ['httpService', '$http'];

function ordersController(httpService, $http) { //TODO finish this
  var vm = this;
  vm.http = httpService;
  vm.stores = []
  if (!vm.http.loadUserOrders) {
    vm.http.loadUserOrders = vm.http.createRequest('http://localhost:3001/graphql', {
        headers: {
          'Content-Type': 'application/json'
        }
      },
      data => {vm.stores = data.data.allOrders.edges.map(a => a.node)},
      data => {return { "query": "{ allStores {    edges {     node {       id       storeName      }}}}"}
      } // this will query by location to user at somepoint
    )
  }
  vm.http.loadUserOrders();
  
}
