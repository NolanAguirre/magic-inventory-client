angular
  .module('app')
  .controller('StoresController', storesController);


storesController.$inject = ['httpService', 'GraphqlService'];

function storesController(httpService, graphqlService) {
  var vm = this;
  vm.http = httpService;
  httpService.graphql(graphqlService.allStores({
    data: ["name", "id"],
    format:{
      first:10
    }
  })).then((res) => {
    vm.stores = res.data.data.allStores.edges.map((item) => item = item.node);
  }, (err) => {
    console.log(err);
  })
  vm.viewInventory = function(store){
    alert(store);
  }
}
