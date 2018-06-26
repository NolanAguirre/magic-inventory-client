angular
  .module('app')
  .controller('AdminOrdersController', adminOrdersController)

adminOrdersController.$inject = ['httpService', 'GraphqlService', 'StorageService']

function adminOrdersController(http, graphql, storage) {
  var vm = this;
  orderOrdersBy = "NATURAL";
  vm.orderSet = {}
  let anyTotal = {
    low: 0,
    high: 100000000
  };
  vm.pagination = {
    totalItems: 100,
    currentPage: 1,
    maxSize: 5
  }
  vm.getOrders = () => {
    let tempOrderStatus = {
      isNull: false
    }
    if (vm.status != "ANY") {
      tempOrderStatus.equalTo = vm.status
    }
    http.graphql(graphql.allOrders({
      data: ["createdAt", "orderStatus", "price", "nodeId", {
        userByUserId: ["name"]
      }],
      format: {
        first: 5,
        offset: (vm.pagination.currentPage - 1) * 5,
        orderBy: orderOrdersBy
      }
    }, {
      filter: {
        price: {
          greaterThan: vm.total.low,
          lessThanOrEqualTo: vm.total.high
        },
        createdAt: {
          greaterThan: vm.date
        },
        orderStatus: tempOrderStatus
      },
      condition: {
        storeId: storage.data.storeId
      }
    })).then((res) => {
      vm.orderSet = res.data.data.allOrders;
      vm.pagination.totalItems = res.data.data.allOrders.totalCount;
    })
  }
  vm.orderFilters = [{
    name: "Order Status",
    id: "status",
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
    options: [{
      name: "Any",
      value: "2017-06-26T01:10:54.640Z"
    }, {
      name: "Today",
      value: new Date(Math.abs(new Date() - 86400000)).toISOString()
    }, {
      name: "Past 3 days",
      value: new Date(Math.abs(new Date() - 86400000 * 3)).toISOString()
    }, {
      name: "Past Week",
      value: new Date(Math.abs(new Date() - 86400000 * 7)).toISOString()
    }, {
      name: "Past Month",
      value: new Date(Math.abs(new Date() - 86400000 * 31)).toISOString() //not exact, bite me
    }, {
      name: "Past Year",
      value: new Date(Math.abs(new Date() - 86400000 * 365)).toISOString() //not exact either, forget leap years
    }]
  }, {
    name: "Order Total",
    id: "total",
    options: [{
      name: "Any",
      value: anyTotal
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
        high: 100000000
      }
    }]
  }]
  vm.orderSorts = [{
    name: "Order Status",
    sort: () => {
      if (orderOrdersBy == "ORDER_STATUS_ASC") {
        orderOrdersBy = "ORDER_STATUS_DESC"
      } else {
        orderOrdersBy = "ORDER_STATUS_ASC"
      }
      vm.getOrders()
    }
  }, {
    name: "Date Placed",
    sort: () => {
      if (orderOrdersBy == "CREATED_AT_ASC") {
        orderOrdersBy = "CREATED_AT_DESC"
      } else {
        orderOrdersBy = "CREATED_AT_ASC"
      }
      vm.getOrders()
    }
  }, {
    name: "Order Total",
    sort: () => {
      if (orderOrdersBy == "PRICE_ASC") {
        orderOrdersBy = "PRICE_DESC"
      } else {
        orderOrdersBy = "PRICE_ASC"
      }
      vm.getOrders()
    }
  }]
  vm.updateOrder = function(newStatus, order) {
    if (!newStatus) {
      return;
    }
    http.graphql(graphql.updateOrder({
      data: ["id"]
    }, {
      input: {
        nodeId: order.node.nodeId,
        orderPatch: {
          orderStatus: newStatus
        }
      }
    })).then((res) => {
      console.log(res)
      vm.getOrders();
    })
  }
  vm.date = "2017-06-26T01:10:54.640Z";
  vm.status = "ANY";
  vm.total = anyTotal;
  vm.getOrders();
}
