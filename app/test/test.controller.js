angular
  .module('app')
  .controller('TestController', testController);


testController.$inject = ['httpService', 'GraphqlService'];

function testController(httpService, graphqlService) {
  var vm = this;
  vm.http = httpService;
  vm.graphql = graphqlService;
  vm.graphql.registerQuery("createStore", {
    storeName: true,
    id:false
  }, (returnVal, dataRequested) => {return `mutation {\ncreateStore(input:{store:${returnVal}}) {\nstore {\n${dataRequested}}\n}\n}\n`})

  var input = {
    storeName: "Nolans magic shop"
  }
  var output = [
      "storeName",
      "id"
  ];
  console.log(vm.graphql.createStore(input, output));


}
