(function() {

  'use strict';

  angular
    .module('app')
    .service('CartService', cartService);

  cartService.$inject = ['httpService', 'GraphqlService'];

  function cartService(http, graphql) {
      let items = [];
      function addItem(item){
          if(!item.requestedQuantity || item.requestedQuantity == 0){
              return;
          }
          for(let x = 0; x < item.requestedQuantity; x++){
              let tempItem = Object.assign({}, item);
              tempItem.id = item.id.pop();
              item.quantity--;
              items.push(tempItem);
          }
          item.requestedQuantity = 0;
          window.alert("Item added to cart");
      }

      function getItems(){
          return items;
      }
      function getCount(){
          return items.length;
      }
      function getTotal(){
          return 0;
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
          checkout:checkout,
          getCount: getCount,
          getTotal: getTotal
      }
  }
})();
