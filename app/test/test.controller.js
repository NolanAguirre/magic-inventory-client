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
    http.graphql(graphql.createOrder({
      data: ["id"],
    },{
      order:{
        storeId: storeID,
        userId: userID,
        orderStatus: o,
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
  vm.createInventory = () => {
    http.graphql(graphql.createInventory({
      data:["id"]
    }, {
      inventory: {
        cardId: vm.card,
        storeId: vm.store,
        condition: "MINT"
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
      data: ["id"]
    })).then((res) => {
      console.log(res.data.data.allCards);
      vm.cards = res.data.data.allCards.edges;
    })
  }
  vm.getStores = () => {
    http.graphql(graphql.allStores({
      data: ['name', 'id', 'email','phoneNumber', 'city', 'state', 'zipCode']
    })).then((res) => {
      vm.stores = res.data.data.allStores.edges;
    })
  }
  vm.getKeys = (data) =>{
    return Object.keys(data);
  }
  // vm.getOrder = () =>{http.graphql(graphql.).then((data)=>{console.log(data)})}
  // vm.getInventory = () =>{http.graphql(graphql.).then((data)=>{console.log(data)})}
}
