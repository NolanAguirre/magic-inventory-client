angular
  .module('app')
  .controller('AdminLocalSaleController', adminLocalSaleController)

adminLocalSaleController.$inject = ['httpService', 'GraphqlService', 'StorageService', 'TypeaheadService']

function adminLocalSaleController(http, graphql, storage) {
    var vm = this;
    vm.typeahead = typeahead;
    vm.query = function() {
        http.graphql(graphql.fragment(`
      {
        inventoryByCardNameAndStoreId(argOne:"${vm.typeahead.queryResult}", argTwo:"${storage.data.storeId}"){
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
            console.log(res.data.data);
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
                for (var y = x + 1; y < vm.searchResults.length; y++) {
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
}
