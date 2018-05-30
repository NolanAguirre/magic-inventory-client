angular
  .module('app')
  .controller('TestController', testController);


testController.$inject = ['httpService', 'GraphqlService'];

function testController(httpService, graphqlService) {
  var vm = this;
  vm.http = httpService;
  vm.graphql = graphqlService;
  var input = {store:{
    storeName: "Nolans magic shop"
  }}
  var output = [
    "storeName",
    "id"
  ];
  // input = {
  //   id: "91815e21-0f52-4a99-8073-80dc13a7c846",
  // }
  vm.graphql.registerCRUD("store");
  vm.graphql.registerQueries("store");
  console.log();
  vm.http.graphql(vm.graphql.allStores(input, output)).then(function(res) {
    vm.datas = res.data;
  })

  // vm.graphql.registerQueries({
  //   user:{
  //     name: true,
  //     email: true,
  //     id: false,
  //     store_id: false
  //   }
  // }, {
  //   byInputCondition: true,
  //   byPrimaryKey: true,
  //   byForigenKey: true,
  // })
  // vm.http.graphql(vm.graphql.createUser(input, output)).then(function(res) {
  //   vm.data = res.data;
  // })
  // vm.http.graphql(vm.graphql.userById(input, output)).then(function(res) {
  //   vm.datas = res.data;
  // })
}
