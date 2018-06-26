angular
  .module('app')
  .controller('StoresController', storesController);


storesController.$inject = ['httpService', 'GraphqlService'];

function storesController(httpService, graphql) {
  var vm = this;
  vm.http = httpService;
  vm.activeStore = {};
  httpService.graphql(graphql.allStores({
    data: ["name", "id", "phoneNumber", "email"],
    format: {
      first: 10
    }
  })).then((res) => {
    vm.stores = res.data.data.allStores.edges.map((item) => item = item.node);
  }, (err) => {
    console.log(err);
  })
  vm.viewInventory = (store) => {
    vm.activeStore = store;
    httpService.graphql(graphql.allInventories({
      data: ["price", "condition", {
        cardByCardId: ["name", "setName", "multiverseId"]
      }]
    }, {
      storeId: store.id
    })).then((res) => {
      vm.activeStore.inventory = res.data.data.allInventories.edges.map((element) => {
        return element.node
      });
    })
  }
}
