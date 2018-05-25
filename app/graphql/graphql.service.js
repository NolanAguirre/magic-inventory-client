(function() {

  'use strict';

  angular
    .module('app')
    .service('GraphqlService', graphqlService);

  graphqlService.$inject = [];

  function graphqlService() {
    var queries = {

    }
    var mutations = {

    }
    function registerQuery(key, params, query){
      this[key] = (input, output) => {return queryFactory(query)(input, output,params)};
    }


    function queryFactory(queryCallback) {
      return function(input, dataRequested, params) {
        console.log(input, dataRequested)
        var formattedInput = JSON.stringify(input);
        var formattedDataRequested = "";
        for (var inputData in input) {
          formattedInput = formattedInput.replace(`\"` + inputData + `\"`, inputData)
          if (params[inputData]) {
            formattedInput = formattedInput.replace(`\"` + Object.keys(input[inputData])[0] + `\"`, `\"` + Object.keys(input[inputData])[0] + `\"\n`)
          } else {
            formattedInput = formattedInput.replace(`\"` + Object.keys(input[inputData])[0] + `\"`, Object.keys(input[inputData])[0] + `\n`)
          }
        }
        for (var outputData in dataRequested) {
          formattedDataRequested += dataRequested[outputData] + `\n`;
        }
        return {"query" : queryCallback(formattedInput, formattedDataRequested)};
      }
    }
    // var stores = {
    //   createStore: {
    //     parameters: {
    //       storeName: true,
    //       id: false
    //     },
    //     getQuery: queryFactory((returnVal, dataRequested) => {
    //       return `mutation {\ncreateStore(input:{store:${returnVal}}) {\nstore {\n${dataRequested}}\n}\n}\n`
    //     })
    //   }
    // }
    // var store = {
    //   id: 123,
    //   storeName: "nolan"
    // }
    // var output = [
    //   "name",
    //   "id"
    // ]
    // console.log(stores.createStore.getQuery(store, output));
    return {
      registerQuery: registerQuery
    }
  }
})();
