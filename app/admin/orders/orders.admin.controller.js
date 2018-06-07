angular
  .module('app')
  .controller('AdminOrdersController', adminOrdersController)

adminOrdersController.$inject = ['httpService', 'GraphqlService']

function adminOrdersController(http, graphql) {
  var vm = this;
  var orders;
  vm.getOrders = () => {
    http.graphql(graphql.allOrders({
      data: ['orderStatus', 'price', 'createdAt', 'nodeId', {
        userByUserId: ['name', 'email']
      }, {
        orderItemsByOrderId: [{
          inventoryByInventoryId: ['price', 'condition', {
            cardByCardId: ["name", "setName"]
          }]
        }]
      }]
    }, {
      storeId: "bfba1d4c-7842-42a8-9884-a201af2a96fc"
      // TODO: create local storage service to store a admin's store id
    })).then((res) => {
      orders = res.data.data.allOrders.edges.map((element) => {
        element.node.createdAt = new Date(element.node.createdAt);
        return element;
      });
    })
  }
  vm.filterOrders = function() {
    let tempOrder = orders;
    vm.activeOrderFilters.forEach((orderFilter) => {
      tempOrder = tempOrder.filter(orderFilter);
    })
    if (vm.activeSort) {
      return tempOrder.sort(vm.activeSort);
    }
    return tempOrder;
  }
  vm.activeOrderFilters = [];
  vm.orderFilters = [{
    name: "Order Status",
    id: "status",
    filterOrder: function(data) {
      return function(element) {
        if (data == "ANY") {
          return true;
        }
        return element.node.orderStatus == data
      }
    },
    options: [{
      name: "Any",
      value: "ANY"
    }, {
      name: "Recived",
      value: "SENT"
    }, {
      name: "Ready",
      value: "READY"
    }, {
      name: "Complete",
      value: "COMPLETE"
    }, {
      name: "Cancled",
      value: "CANCLED"
    }, {
      name: "Unfulfillable",
      value: "UNFULFILLABLE"
    }]
  }, {
    name: "Date Placed",
    id: "date",
    filterOrder: function(data) {
      return function(element) {
        if (data == "ANY") {
          return true;
        }
        return data >= Math.ceil(Math.abs(element.node.createdAt.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      }
    },
    options: [{
      name: "Any",
      value: "ANY"
    }, {
      name: "Today",
      value: 1
    }, {
      name: "Past 3 days",
      value: 3
    }, {
      name: "Past Week",
      value: 7
    }, {
      name: "Past Month",
      value: 31
    }, {
      name: "Past Year",
      value: 365
    }]
  }, {
    name: "Order Total",
    id: "total",
    filterOrder: function(data) {
      return function(element) {
        if (data == "ANY") {
          return true;
        }
        return data.low <= element.node.price && element.node.price <= data.high;
      }
    },
    options: [{
      name: "Any",
      value: "ANY"
    }, {
      name: "Under 10$",
      value: {
        low: 0,
        high: 10
      }
    }, {
      name: "10-50$",
      value: {
        low: 10,
        high: 50
      }
    }, {
      name: "50-200$",
      value: {
        low: 50,
        high: 200
      }
    }, {
      name: "Over 200$",
      value: {
        low: 200,
        high: Infinity
      }
    }]
  }]
  vm.orderSorts = [{
    name: "Order Status",
    sort: function(a, b) {
      // TODO determine how i wannt to sort by order status
    }
  }, {
    name: "Date Placed",
    sort: function(a, b) {
      let date = new Date();
      return Math.ceil(Math.abs(a.node.createdAt.getTime() - date.getTime()) / (1000 * 3600)) > Math.ceil(Math.abs(b.node.createdAt.getTime() - date.getTime()) / (1000 * 3600))
    }
  }, {
    name: "Order Total",
    sort: function(a, b) {
      return a.node.price > b.node.price
    }
  }, {
    name: "By Senders Name",
    sort: function(a, b) {
      if (a.node.userByUserId.name < b.node.userByUserId.name) {
        return -1;
      }
      if (a.node.userByUserId.name > b.node.userByUserId.name) {
        return 1;
      }
      return 0;
    }
  }]
  vm.updateOrder = function(newStatus, order) {
    if (!newStatus) {
      return;
    }
    http.graphql(graphql.updateOrder({
      data: ["id"]
    }, {
      nodeId: order.node.nodeId,
      orderPatch: {
        orderStatus: newStatus
      }
    })).then((res) => {
      vm.getOrders();
    })
  }
  vm.getOrders();
}
