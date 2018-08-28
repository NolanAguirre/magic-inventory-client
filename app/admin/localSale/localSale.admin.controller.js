angular
    .module('app')
    .controller('AdminLocalSaleController', adminLocalSaleController)

adminLocalSaleController.$inject = ['httpService', 'GraphqlService', 'StorageService', 'TypeaheadService']

function adminLocalSaleController(http, graphql, storage, typeahead) {
    var vm = this;
    vm.typeahead = typeahead;
    vm.storage = storage;
    storage.addData('localOrder', new storage.compressedCardList());
    vm.addCardToOrder = (card) => {
        storage.data.localOrder.add(vm.searchResults.remove(card));
    }
    vm.removeCardFromOrder = (card) => {
        storage.data.localOrder.remove(card);
    }
    vm.query = function() {
        http.graphql(graphql.fragment(`
      {
        adminInventoryByCardNameAndStoreId(argOne:"${vm.cardName}"){
          edges{
            node{
              price
              condition
              id
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
                temp.id = [element.node.id];
                if (!element.node.price == 0) {
                    http.getPrice(temp).then((res) => {
                        temp.price = res.data
                    }).catch((err) => {
                        price.price = -1
                    });
                } else {
                    temp.price = element.node.price;
                }
                temp.condition = element.node.condition;
                temp.quantity = 1;
                vm.searchResults.add(temp);
            });

        })
    }
}
