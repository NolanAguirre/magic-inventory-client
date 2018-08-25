angular
    .module('app')
    .controller('StoreController', storeController);


storeController.$inject = ['httpService', 'GraphqlService', 'TypeaheadService', 'StorageService', 'CartService'];

function storeController(http, graphql, typeahead, storage, cart) {
    var vm = this;
    vm.cart = cart;
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
                temp.condition = element.node.condition;
                temp.cardId = element.node.cardId;
                temp.quantity = 1;
                temp.price = (element.node.price == 0)? "fetching price": element.node.price;
                vm.searchResults.add(temp);
            })
            vm.searchResults.fetchPrices((card)=>{
                http.getPrice(card).then((res) => {
                    card.price = res.data;
                }).catch((err) => {
                    card.price = "Failed to fetch";
                });
            })
        })
    }
}
