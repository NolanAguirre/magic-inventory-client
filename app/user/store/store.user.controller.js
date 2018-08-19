angular
    .module('app')
    .controller('StoreController', storeController);


storeController.$inject = ['httpService', 'GraphqlService', 'TypeaheadService', 'StorageService'];

function storeController(httpService, graphql, typeahead, storage) {
    var vm = this;
    vm.http = httpService;
    vm.activeStore = storage.data.activeStore;
    typeahead.setStore(storage.data.activeStore.id);
    vm.typeahead = typeahead;
    vm.query = (name) => {
        httpService.graphql(graphql.fragment(`
      {
        inventoryByCardNameAndStoreId(argOne:"${name}", argTwo:"${vm.activeStore.id}"){
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
                if (element.node.price == -1) {
                    http.getPrice(temp).then((res) => {
                        temp.price = res.data
                    }).catch((err) => {
                        price.price = "Price not avialable at this time"
                    });
                } else {
                    temp.price = element.node.price;
                }
                temp.condition = element.node.condition;
                temp.id = [element.node.id];
                temp.showQuantity = true;
                temp.showAdvancedQuantity = false;
                temp.showPrice = true;
                temp.showCondition = true;
                temp.quantity = 1;
                vm.searchResults.add(temp);
            })
        })
    }
}
