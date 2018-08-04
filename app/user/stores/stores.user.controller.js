angular
    .module('app')
    .controller('StoresController', storesController);


storesController.$inject = ['httpService', 'GraphqlService', 'TypeaheadService', 'StorageService'];

function storesController(httpService, graphql, typeahead, storage) {
    var vm = this;
    vm.http = httpService;
    vm.activeStore = {};
    vm.typeahead = typeahead;
    httpService.graphql(graphql.allStores({
        data: ["name", "id", "phoneNumber", "email"],
        format: {
            first: 10
        }
    })).then((res) => {
        console.log(res);
        vm.stores = res.data.data.allStores.edges.map((item) => item = item.node);
    });
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
                // if (!element.node.price) {
                //     http.getPrice(temp).then((res) => {
                //         temp.price = res.data
                //     }).catch((err) => {
                //         price.price = -1
                //     });
                // } else {
                //     temp.price = element.node.price;
                // }
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
