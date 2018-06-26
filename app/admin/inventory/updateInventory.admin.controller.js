angular
  .module('app')
  .controller('AdminUpdateInventoryController', adminUpdateInventoryController)

adminUpdateInventoryController.$inject = ["httpService", "GraphqlService", "StorageService"];

function adminUpdateInventoryController(http, graphql, storage) {
  var vm = this;
  vm.updateInventory = function(card){
      http.graphql(graphql.fragment(`
        mutation{
          updateInventoryById(input:{id:"${card.id}", inventoryPatch:{price:${card.price},condition:${card.condition}}}){
            inventory{
              price
              condition
              id
              cardByCardId{
                setName
                name
                multiverseId
              }
            }
          }
        }
        `)).then((res)=>{
          
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
      `
    )).then((res) => {
      vm.searchResults = res.data.data.inventoryByCardNameAndStoreId.edges.map((element) => {
        return {...element.node, ...element.node.cardByCardId, isUpdatingInventory:true}
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
