(function() {

  'use strict';

  angular
    .module('app')
    .service('CartService', cartService);

  cartService.$inject = ['httpService', 'GraphqlService'];

  function cartService(http, graphql) {
      let items = [];
      function addItem(item){
          items.push(item);
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
