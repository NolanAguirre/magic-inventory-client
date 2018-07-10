angular
    .module('app')
    .controller('AdminViewInventoryController', adminViewInventoryController)

adminViewInventoryController.$inject = ["httpService", "GraphqlService", "StorageService", "TypeaheadService"];

function adminViewInventoryController(http, graphql, storage, typeahead) {
    var vm = this;
    vm.typeahead = typeahead;
    vm.query = function(name) {
        http.graphql(graphql.fragment(`
      {
        inventoryByCardNameAndStoreId(argOne:"${name}", argTwo:"${storage.data.storeId}"){
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
      `)).then((res) => {
            vm.searchResults = new storage.compressedCardList();
            res.data.data.inventoryByCardNameAndStoreId.edges.forEach((element) => {
                let temp = element.node.cardByCardId;
                temp.condition = element.node.condition;
                temp.price = element.node.price;
                temp.id = [element.node.id];
                temp.showQuantity = true;
                temp.showAdvancedQuantity = false;
                temp.showPrice = true;
                temp.showCondition = true;
                temp.quantity = 1;
                vm.searchResults.add(temp);
            });
        })
    }
}
