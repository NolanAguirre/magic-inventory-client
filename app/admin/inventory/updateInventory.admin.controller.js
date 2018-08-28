angular
  .module('app')
  .controller('AdminUpdateInventoryController', adminUpdateInventoryController)

adminUpdateInventoryController.$inject = ["httpService", "GraphqlService", "StorageService", "TypeaheadService"];

function adminUpdateInventoryController(http, graphql, storage, typeahead) {
  var vm = this;
  vm.typeahead = typeahead;
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
  vm.query = function(name) {
    http.graphql(graphql.fragment(`
      {
        adminInventoryByCardNameAndStoreId(argOne:"${name}"){
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
      vm.searchResults = res.data.data.adminInventoryByCardNameAndStoreId.edges.map((element) => {
        return {...element.node, ...element.node.cardByCardId}
      });
      console.log(vm.searchResults)
    })
  }
 // vm.typeahead =
}
