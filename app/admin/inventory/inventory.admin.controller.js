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
        let temp = element.node.cardByCardId;
        temp.condition = element.node.condition || "Light play";
        temp.price = element.node.price;
        temp.nodeId = [element.node.nodeId];
        temp.quantity = 1;
        return temp;
      });
      for (var x = 0; x < vm.inventory.length; x++) {
        for (var y = x +1; y < vm.inventory.length; y++) {
          if (vm.inventory[x].name == vm.inventory[y].name &&
              vm.inventory[x].condition == vm.inventory[y].condition &&
              vm.inventory[x].set == vm.inventory[y].set) {
                vm.inventory[x].quantity++;
                vm.inventory[x].nodeId.push(vm.inventory[y].nodeId[0]);
                vm.inventory.splice(y--, 1);
            }
        }
      }
    })
  }
  vm.loadInventory();
}
