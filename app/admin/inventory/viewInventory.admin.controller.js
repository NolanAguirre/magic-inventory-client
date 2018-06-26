angular
  .module('app')
  .controller('AdminViewInventoryController', adminViewInventoryController)

adminViewInventoryController.$inject = ["httpService", "GraphqlService", "StorageService"];

function adminViewInventoryController(http, graphql, storage) {
  var vm = this;
  vm.query = function(queryParams) {
    http.graphql(graphql.fragment(`
      {
        inventoryByCardNameAndStoreId(argOne:"${queryParams}", argTwo:"${storage.data.storeId}"){
          edges{
            node{
              price
              condition
              nodeId
              cardByCardId{
                name
                multiverseId
                setName
              }
            }
          }
        }
      }
      `
    )).then((res) => {
      vm.searchResults = res.data.data.inventoryByCardNameAndStoreId.edges.map((element) => {
        let temp = element.node.cardByCardId;
        temp.condition = element.node.condition;
        temp.price = element.node.price;
        temp.nodeId = [element.node.nodeId];
        temp.showQuantity = true;
        temp.showAdvancedQuantity = false;
        temp.showPrice = true;
        temp.showCondition = true;
        temp.quantity = 1;
        return temp;
      });
      for (var x = 0; x < vm.searchResults.length; x++) {
        for (var y = x +1; y < vm.searchResults.length; y++) {
          if (vm.searchResults[x].name == vm.searchResults[y].name &&
              vm.searchResults[x].condition == vm.searchResults[y].condition &&
              vm.searchResults[x].set == vm.searchResults[y].set) {
                vm.searchResults[x].quantity++;
                vm.searchResults[x].nodeId.push(vm.searchResults[y].nodeId[0]);
                vm.searchResults.splice(y--, 1);
            }
        }
      }
    })
  }
  vm.typeahead = function(name) {
    return http.graphql(graphql.fragment(`
        {
          inventoryTypeahead(argOne:"${name + "%"}", argTwo:"${storage.data.storeId}"){
            edges{
              node
            }
          }
        }
      `)).then((res) => {
      return res.data.data.inventoryTypeahead.edges.map((element) => {
        return element.node
      })
    })
  }
}
