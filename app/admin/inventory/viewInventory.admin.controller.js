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
        adminInventoryByCardNameAndStoreId(argOne:"${name}"){
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
            res.data.data.adminInventoryByCardNameAndStoreId.edges.forEach((element) => {
                let temp = element.node.cardByCardId;
                temp.id = [element.node.id]
                temp.condition = element.node.condition;
                temp.cardId = element.node.cardId;
                temp.quantity = 1;
                temp.price = (element.node.price == 0) ? "fetching price" : element.node.price;
                vm.searchResults.add(temp);
            })
            vm.searchResults.fetchPrices((card) => {
                let tempCard = {
                    condition: card.condition,
                    setName: card.setName,
                    name: card.name
                }
                http.getPrice(tempCard).then((res) => {
                    card.price = res.data;
                }).catch((err) => {
                    card.price = "Failed to fetch";
                });
            })
        })
    }
}
