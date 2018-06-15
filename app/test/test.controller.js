angular
  .module('app')
  .controller('TestController', testController);


testController.$inject = ['httpService', 'GraphqlService'];

function testController(http, graphql) {
  var vm = this;
  vm.createUser = (n, e) => {
    http.graphql(graphql.createUser({
      data: ["id"]
    }, {
      user: {
        name: n,
        email: e
      }
    })).then((data) => {
      console.log(data)
    })
  }
  vm.createOrder = (storeID, userID, o, p) => {
    console.log(userID);
    http.graphql(graphql.createOrder({
      data: ["id"],
    },{
      order:{
        storeId: storeID,
        userId: userID,
        orderStatus: o.toUpperCase(),
        price: p
      }
    })).then((data) => {
      console.log(data)
    })
  }
  vm.createStore = (n,e,p,c,s,z) => {
    http.graphql(graphql.createStore({
      data: ["id"]
    }, {
      store: {
        name: n,
        email: e,
        phoneNumber: p,
        city: c,
        state: s.toUpperCase(),
        zipCode: z
      }
    })).then((data) => {
      console.log(data)
    })
  }
  vm.createInventory = (cId,s,c, p) => {
    http.graphql(graphql.createInventory({
      data:["id"]
    }, {
      inventory: {
        cardId: cId,
        storeId: s,
        condition: c.toUpperCase(),
        price: p,
        status: "AVAILABLE"
      }
    })).then((data) => {
      console.log(data)
    })
  }
  vm.createOrderItem = (n,i) => {
    http.graphql(graphql.createOrderItem({
      data:["id"]
    }, {
      orderItem: {
        orderId: n,
        inventoryId: i
      }
    })).then((data) => {
      console.log(data)
    })
  }

  vm.getUser = () => {
    http.graphql(graphql.allUsers({
      data: ["id",'name', 'email']
    })).then((res) => {
      vm.users = res.data.data.allUsers.edges;
    })
  }
  vm.getCard = () => {
    http.graphql(graphql.allCards({
      data: ["id", 'name', 'setName', 'multiverseId'],
      format:{
        first:30
      }
    })).then((res) => {
      vm.cards = res.data.data.allCards.edges;
    })
  }
  vm.getOrder = () => {
    http.graphql(graphql.allOrders({
      data: ["id", 'storeId', 'userId','orderStatus','price','createdAt']
    })).then((res) => {
      vm.orders = res.data.data.allOrders.edges;
    })
  }
  vm.getStore = () => {
    http.graphql(graphql.allStores({
      data: ['name', 'id', 'email','phoneNumber', 'city', 'state', 'zipCode']
    })).then((res) => {
      vm.stores = res.data.data.allStores.edges;
    })
  }
  vm.getInventory = () => {
    http.graphql(graphql.allInventories({
      data: ['id', 'storeId', 'status', 'cardId', {cardByCardId:["name", "setName", "multiverseId"]}]
    })).then((res) => {
      vm.inventories = res.data.data.allInventories.edges;
    })
  }
  vm.getOrderItem = () => {
    http.graphql(graphql.allOrderItems({
      data: ['id', 'inventoryId', 'orderId']
    })).then((res) => {
      vm.orderItems = res.data.data.allOrderItems.edges;
    })
  }
  vm.getKeys = (data) =>{
    return Object.keys(data);
  }
}
