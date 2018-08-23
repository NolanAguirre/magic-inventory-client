(function() {

  'use strict';

  angular
    .module('app')
    .service('CartService', cartService);

  cartService.$inject = ['httpService', 'GraphqlService'];

  function cartService(http, graphql) {
      let items = [];
      function addItem(item){
          for(let x = 0; x < item.requestedQuantity; x++){
              let tempItem = Object.assign({}, item);
              tempItem.id = item.id.pop();
              item.quantity--;
              items.push(tempItem);
          }
      }
      function getItems(){
          return items;
      }
      function checkout(){
          let itemsWithIssues = items.filter(async (item)=>{
              let data = await http.graphql(graphql.fragment(`
                  {
                      allInventories(condition:{id:"${item.id}", status:AVAILABLE}){
                          totalCount
                      }
                  }
                  `));
                  return data.data.data.totalCount != 0;
          });
          if(itemsWithIssues.length > 0){
              return itemsWithIssues;
          }
          return null;
      }
      return {
          addItem:addItem,
          getItems:getItems,
          checkout:checkout
      }
  }
})();
