angular
  .module('app')
  .controller('AdminViewInventoryController', adminViewInventoryController)

adminViewInventoryController.$inject = ["httpService", "GraphqlService", "StorageService"];

function adminViewInventoryController(http, graphql, storage) {
  var vm = this;
  vm.query = (data) => {
    http.graphql(graphql.allInventories({
        data: ['nodeId', 'condition', 'price', {
          cardByCardId: ['name', 'setName', 'multiverseId']
        }]
      }, {
        storeId: storage.data.storeId,
        status: "AVAILABLE"
      })).then((res) => {
        vm.searchResults = res.data.data.allInventories.edges.map((element) => {
          let temp = element.node.cardByCardId;
          temp.condition = element.node.condition;
          temp.price = element.node.price;
          temp.nodeId = [element.node.nodeId];
          temp.quantity = 1;
          temp.viewInventory = true;
          return temp;
        });
        for (var x = 0; x < vm.searchResults.length; x++) {
          for (var y = x +1; y < vm.searchResults.length; y++) {
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
  //  function(queryParams){
  //    http.graphql(graphql.allCards({
  //     data:['nodeId', 'id', 'name', 'setName', 'setCode', 'multiverseId']
  //   },{
  //       name: queryParams
  //   })).then((res)=>{
  //     vm.searchResults = res.data.data.allCards.edges.map((element)=>{
  //       return element.node;
  //     })
  //   })
  // }
  vm.typeahead = function(name) {
    return http.graphql(graphql.allInventories({
      data: [{
        cardByCardId: ['name']
      }]
    }, {
      storeId: storage.data.storeId,
      status: "AVAILABLE"
    })).then((res) => {
      return res.data.data.allInventories.edges.map((element) => {
        return element.node.cardByCardId.name;
      }).filter(function(item, i, ar) {
        return ar.indexOf(item) === i;
      });
    })
  }
}
