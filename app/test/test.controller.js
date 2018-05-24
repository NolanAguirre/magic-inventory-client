angular
  .module('app')
  .controller('StoresController', storesController);


storesController.$inject = ['httpService'];

function storesController(httpService) {
  var vm = this;
  vm.http = httpService;
  vm.stores = []
  if (!vm.http.queryStores) {
    vm.http.queryStores = vm.http.createRequest('http://localhost:3001/graphql', {
        headers: {
          'Content-Type': 'application/json'
        }
      },
      (view, data) => {view.stores = data.data.allStores.edges.map(a => a.node)},
      data => {return { "query": "{ allStores {    edges {     node {       id       storeName      }}}}"}
      } // this will query by location to user at somepoint
    )
  }
  vm.queryStores = function(queryParams){
    return vm.http.queryStores({view:vm, data: queryParams})
  }
  vm.queryStores();
}
