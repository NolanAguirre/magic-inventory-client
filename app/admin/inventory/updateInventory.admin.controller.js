angular
  .module('app')
  .controller('AdminUpdateInventoryController', adminUpdateInventoryController)

adminUpdateInventoryController.$inject = ["httpService", "GraphqlService", "StorageService"];

function adminUpdateInventoryController(http, graphql, storage) {
  var vm = this;
  vm.loadInventory = () => {
    http.graphql(graphql.allInventories({
      data: ['nodeId', 'condition', 'price', {
        cardByCardId: ['name', 'setName', 'multiverseId']
      }]
    }, {
      storeId: storage.data.storeId
    })).then((res) => {
      vm.inventory = res.data.data.allInventories.edges.map((element) => {
        let temp = element.node.cardByCardId;
        temp.condition = element.node.condition;
        temp.price = element.node.price;
        temp.nodeId = element.node.nodeId;
        return temp;
      });
    })
  }
  vm.query = function(queryParams) {
    http.graphql(graphql.fragment(`
      {
        inventoryByCardNameAndStoreId(argOne:"${queryParams}", argTwo:"${storage.data.storeId}"){
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
      `
    )).then((res) => {
      vm.searchResults = res.data.data.inventoryByCardNameAndStoreId.edges.map((element) => {
        let temp = element.node.cardByCardId;
        temp.condition = element.node.condition;
        temp.price = element.node.price;
        temp.nodeId = element.node.nodeId;
        return temp;
      });
    })
  }
  vm.typeahead = function(name) {
    return http.graphql(graphql.fragment(`
        {
          inventoryTypeahead(argOne:"${name + "%"}", argTwo:"${storage.data.storeId}"){
            edges{
              node
            }
          }
        }
      `)).then((res) => {
      return res.data.data.inventoryTypeahead.edges.map((element) => {
        return element.node
      })
    })
  }
}
