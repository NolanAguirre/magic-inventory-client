angular
  .module('app')
  .controller('InventoryController', inventoryController)

inventoryController.$inject = ["httpService", "GraphqlService"];

function inventoryController(http, graphql) {
  var vm = this;
  vm.loadInventory = () => {
    http.graphql(graphql.allInventories({
      data: ['nodeId', 'condition', 'price', {
        cardByCardId: ['name', 'setName', 'multiverseId']
      }]
    }, {
      storeId: "878927df-30bd-4f86-829b-bfceb1a212ed"
    })).then((res) => {
      vm.inventory = res.data.data.allInventories.edges.map((element) => {
        let temp = element.node;
        temp.card = temp.cardByCardId;
        return temp;
      });
    })
  }
  vm.loadInventory();
}
