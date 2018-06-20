angular
  .module('app')
  .controller('AdminAddInventoryController', adminAddInventoryController)

adminAddInventoryController.$inject = ["httpService", "GraphqlService", "StorageService"];

function adminAddInventoryController(http, graphql, storage) {
  var vm = this;
  vm.addInventory = function(card) {
    if (card.id && card.condition) {
      for (var x = 0; x < card.quantity; x++) {
        http.graphql(graphql.createInventory({
          data: ["id"]
        }, {
          inventory: {
            cardId: card.id,
            storeId: storage.data.storeId,
            condition: card.condition,
            price: card.price,
            status: "AVAILABLE"
          }
        })).then((data) => {
          console.log(data)
        })
      }
    }
  }
  vm.addByName = {};
  vm.addByName.query = function(queryParams) {
    http.graphql(graphql.allCards({
      data: ['nodeId', 'id', 'name', 'setName', 'setCode', 'multiverseId']
    }, {
      name: queryParams
    })).then((res) => {
      vm.addByName.searchResults = res.data.data.allCards.edges.map((element) => {
        element.node.isCreatingInventory = true;
        element.node.condition = "LIGHTLY_PLAYED"
        return element.node;
      })
    })
  }
  vm.addByName.typeahead = function(name) {
    return http.graphql(graphql.allCardNames({
      data: ['name'],
      format: {
        first: 10,
        filter: {
          name: {
            startsWith: name
          }
        }
      }
    })).then((res) => {
      return res.data.data.allCardNames.edges.map((element) => {
        return element.node.name
      })
    })
  }
}
