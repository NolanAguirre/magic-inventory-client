angular
  .module('app')
  .controller('AdminUpdateInventoryController', adminUpdateInventoryController)

adminUpdateInventoryController.$inject = ["httpService", "GraphqlService", "StorageService"];

function adminUpdateInventoryController(http, graphql, storage) {
  var vm = this;
  vm.loadInventory = () => {
    http.graphql(graphql.allInventories({
      data: ['nodeId', 'condition', 'price', {
        cardByCardId: ['name', 'setName', 'multiverseId']
      }]
    }, {
      storeId: storage.data.storeId
    })).then((res) => {
      vm.inventory = res.data.data.allInventories.edges.map((element) => {
        let temp = element.node.cardByCardId;
        temp.condition = element.node.condition;
        temp.price = element.node.price;
        temp.nodeId = [element.node.nodeId];
        temp.quantity = 1;
        return temp;
      });
      for (var x = 0; x < vm.inventory.length; x++) {
        for (var y = x + 1; y < vm.inventory.length; y++) {
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
  vm.query = function(queryParams) {
    http.graphql(graphql.allCards({
      data: ['nodeId', 'id', 'name', 'setName', 'setCode', 'multiverseId']
    }, {
      name: queryParams
    })).then((res) => {
      vm.searchResults = res.data.data.allCards.edges.map((element) => {
        element.node.updatingInventory = true;
        return element.node;
      })
    })
  }
  vm.typeahead = function(name) {
    return http.graphql(graphql.allInventories({
      data: [{
        cardByCardId: ['name']
      }]
    }, {
      storeId: storage.data.storeId,
      status: "AVAILABLE"
    })).then((res) => {
      return res.data.data.allInventories.edges.map((element) => {
        return element.node.cardByCardId.name;
      }).filter(function(item, i, ar) {
        return ar.indexOf(item) === i;
      });
    })
  }
}
