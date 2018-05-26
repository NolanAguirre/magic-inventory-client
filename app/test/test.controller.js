angular
  .module('app')
  .controller('TestController', testController);


testController.$inject = ['httpService', 'GraphqlService'];

function testController(httpService, graphqlService) {
  var vm = this;
  vm.http = httpService;
  vm.graphql = graphqlService;
  var input = {
    storeName: "Nolans magic shop"
  }
  var output = [
    "storeName",
    "id"
  ];
  vm.graphql.registerQuery("createStore", {
    storeName: true,
    id: false
  }, (returnVal, dataRequested) => {
    return `mutation {\ncreateStore(input:{store:${returnVal}}) {\nstore {\n${dataRequested}}\n}\n}\n`
  })
  vm.http.graphql(vm.graphql.createStore(input, output)).then(function(res) {
    vm.stores = res.data;
  })

  input = {
    id: "91815e21-0f52-4a99-8073-80dc13a7c846",
  }
  output = [
    "email",
    "name",
    "id"
  ];
  // vm.graphql.registerQuery("createUser", {
  //   name:true,
  //   email:true,
  //   id: false
  // }, (input, output) => {
  //   return `mutation {\ncreateUser(input:{user:${input}}) {\nuser{\n${output}}\n}\n}\n`
  // })
  vm.graphql.registerCRUD({
    user: {
      name: true,
      email: true,
      id: false
    }
  });
  vm.graphql.registerQueries({
    user:{
      name: true,
      email: true,
      id: false,
      store_id: false
    }
  }, {
    byInputCondition: true,
    byPrimaryKey: true,
    byForigenKey: true,
  })
  // vm.http.graphql(vm.graphql.createUser(input, output)).then(function(res) {
  //   vm.data = res.data;
  // })
  vm.http.graphql(vm.graphql.userById(input, output)).then(function(res) {
    vm.datas = res.data;
  })
}
