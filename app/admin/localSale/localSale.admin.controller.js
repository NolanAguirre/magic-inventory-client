angular
  .module('app')
  .controller('AdminLocalSaleController', adminLocalSaleController)

adminLocalSaleController.$inject = ['httpService', 'GraphqlService', 'StorageService', 'TypeaheadService']

function adminLocalSaleController(http, graphql, storage, typeahead) {
    var vm = this;
    vm.typeahead = typeahead;
    vm.storage = storage;
    storage.addData('localOrder',new storage.compressedCardList());
    vm.addCardToOrder = (card) =>{
        storage.data.localOrder.add(vm.searchResults.remove(card));
    }
    vm.removeCardFromOrder = (card) =>{
        storage.data.localOrder.remove(card);
    }
    vm.query = function() {
        http.graphql(graphql.fragment(`
      {
        inventoryByCardNameAndStoreId(argOne:"${vm.cardName}", argTwo:"${storage.data.storeId}"){
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
            res.data.data.inventoryByCardNameAndStoreId.edges.forEach((element) => {
                let temp = element.node.cardByCardId;
                if(!element.node.price){
                    http.getPrice(temp).then((res) => {
                        temp.price = res.data
                    }).catch((err) => {
                        price.price = -1
                    });
                }else{
                    temp.price = element.node.price;
                }
                temp.condition = element.node.condition;
                temp.id = [element.node.id];
                temp.showQuantity = true;
                temp.showAdvancedQuantity = true;
                temp.showPrice = true;
                temp.showCondition = true;
                temp.isPlacingOrder = true;
                temp.quantity = 1;
                vm.searchResults.add(temp);
            });

        })
    }
}
