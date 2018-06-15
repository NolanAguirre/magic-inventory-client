angular
  .module('app')
  .controller('AdminAddInventoryController', adminAddInventoryController)

adminAddInventoryController.$inject = ["httpService", "GraphqlService", "StorageService"];

function adminAddInventoryController(http, graphql, storage) {
  var vm = this;
  vm.addInventory = function(card){
    if(card.id && card.condition){
      http.graphql(graphql.createInventory({
        data:["id"]
      }, {
        inventory: {
          cardId: card.id,
          storeId: storage.data.storeId,
          condition: card.condition,
          price: card.price
        }
      })).then((data) => {
        console.log(data)
      })
    }
  }
  vm.query = function(queryParams){
     http.graphql(graphql.allCards({
      data:['nodeId', 'id', 'name', 'setName', 'setCode', 'multiverseId']
    },{
        name: queryParams
    })).then((res)=>{
      vm.searchResults = res.data.data.allCards.edges.map((element)=>{
        element.node.addingInventory = true;
        return element.node;
      })
    })
  }
  vm.typeahead = function(name){
    return http.graphql(graphql.allCardNames({
     data:['name'],
     format:{
       first:10,
       filter:{
         name:{
           startsWith:name
         }
       }
     }
   })).then((res) =>{
      return res.data.data.allCardNames.edges.map((element)=>{
        return element.node.name
      })
    })
  }
}
