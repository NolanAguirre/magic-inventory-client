angular
    .module('app')
    .controller('AdminViewInventoryController', adminViewInventoryController)

adminViewInventoryController.$inject = ["httpService", "GraphqlService", "StorageService", "TypeaheadService"];

function adminViewInventoryController(http, graphql, storage, typeahead) {
    var vm = this;
    vm.typeahead = typeahead;
    vm.query = (name) => {
        http.graphql(graphql.fragment(`
      {
        inventoryByCardNameAndStoreId(argOne:"${name}", argTwo:"${vm.activeStore.id}"){
          edges{
            node{
              id
              price
              condition
              cardId
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
                temp.id = [element.node.id]
                if (element.node.price == 0) {
                    http.getPrice(temp).then((res) => {
                        temp.price = res.data
                    }).catch((err) => {
                        price.price = "Price not avialable at this time"
                    });
                } else {
                    temp.price = element.node.price;
                }
                temp.condition = element.node.condition;
                temp.cardId = element.node.cardId;
                temp.quantity = 1;
                vm.searchResults.add(temp);
            })
        })
    }
    }
}
