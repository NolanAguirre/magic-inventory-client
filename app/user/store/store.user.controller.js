angular
    .module('app')
    .controller('StoreController', storeController);


storeController.$inject = ['httpService', 'GraphqlService', 'TypeaheadService', 'StorageService'];

function storeController(http, graphql, typeahead, storage) {
    var vm = this;
    storage.data.activeStore = {
        id:'6cefb59a-3d71-462a-8862-e8f7f9ee7515'
    }
    vm.activeStore = storage.data.activeStore;
    typeahead.setStore(storage.data.activeStore.id);
    vm.typeahead = typeahead;
    vm.query = (name) => {
        http.graphql(graphql.fragment(`
      {
        inventoryByCardNameAndStoreId(argOne:"${name}", argTwo:"${vm.activeStore.id}"){
          edges{
            node{
              price
              condition
              cardByCardId{
                name
                multiverseId
                setName
                id
              }
            }
          }
        }
      }
      `)).then((res) => {
            vm.searchResults = new storage.compressedCardList();
            res.data.data.inventoryByCardNameAndStoreId.edges.forEach((element) => {
                let temp = element.node.cardByCardId;
                temp.id = [element.node.cardByCardId.id]
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
                temp.quantity = 1;
                vm.searchResults.add(temp);
            })
        })
    }
}
