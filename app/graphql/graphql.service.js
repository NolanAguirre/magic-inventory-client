(function() {

  'use strict';

  angular
    .module('app')
    .service('GraphqlService', graphqlService);

  graphqlService.$inject = [];

  function graphqlService() {
    function registerQuery(key, params, query) {
      this[key] = (input, output) => {
        return queryFactory(query, false)(input, output, params) // false means its a query not a mutation
      };
    }

    function registerCRUD(params) {
      var name = Object.keys(params)[0];
      var graphql = this;
      ["create", "delete", "update"].forEach(operation => {
        graphql[operation + toTitleCase(name)] = (input, output) => {
          return queryFactory((input, output) => {
            return `mutation {\n${operation + toTitleCase(name)}(input:{${name.toLowerCase()}:${input}}) {\n${name.toLowerCase()}{\n${output}}\n}\n}\n`
          })(input, output, params)
        }
      })
    }

    function registerQueries(params, config) {
      var name = Object.keys(params)[0];
      var otherQueries = Object.keys(params[name]).filter(key => key.endsWith("_id")).map(key => key = key.replace("_id", "Id"));
      var temp;
      var graphql = this;
      if (!config || config.byInputCondition) {
        graphql["all" + toTitleCase(name) + "s"] = (input, output) => {
          return queryFactory((input, output) => {
            return `{\n${"all" + toTitleCase(name) + "s"}` + (input ? `(condition:${input})` : "") +
              `{\nnodes{\n${output}}\n}\n}\n`
          })(input, output, params)
        }
      }
      if (config && Object.keys(params[name]).filter(key => key == "id").length == 1 && config.byPrimaryKey) {
        graphql[name.toLowerCase()+ "ById"] = (input, output) => {
          return queryFactory((input, output) => {
            return `{\n${name.toLowerCase() + "ById"}(${input.substring(1, input.length -1)}){\n${output}}\n}\n`
          })(input, output, params)
        }
      }
      if (config && otherQueries.length > 0 && config.byForigenKey) {
        // TODO build forigen key query builder
      }
    }

    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    function queryFactory(queryCallback) {
      return function(input, dataRequested, params) {
        var formattedDataRequested = "";
        var formattedInput = JSON.stringify(input);
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
        return {
          "query": queryCallback(formattedInput, formattedDataRequested)
        };
      }
    }
    return {
      registerQuery: registerQuery,
      registerCRUD: registerCRUD,
      registerQueries,
      registerQueries
    }
  }
})();
