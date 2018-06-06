angular
  .module('app')
  .controller('AdminOrdersController', adminOrdersController)

adminOrdersController.$inject = ['httpService', 'GraphqlService']

function adminOrdersController(http, graphql) {
  var vm = this;

  vm.getOrders = () => {
    http.graphql(graphql.allOrders({
      data: ['orderStatus', 'price', 'createdAt',{userByUserId:['name']},{orderItemsByOrderId:[{inventoryByInventoryId:['price', 'condition', {cardByCardId:["name", "setName"]}]}]}]
    })).then((res) => {
      vm.orders=res.data.data.allOrders.edges;
    })
  }
  vm.getOrders();
}
