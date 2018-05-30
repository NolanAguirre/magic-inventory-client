(function() {

    'use strict';

    angular
      .module('app')
      .service('GraphqlService', graphqlService);

    graphqlService.$inject = [];

    function graphqlService() {
      function registerQueries(name) {
        this["all" + toTitleCase(name) + "s"] = createQuery((output, input) => {
          return {
            "query": `query ${input ? `($data:${toTitleCase(name) + "Condition"})` : ""}{\n${"all" + toTitleCase(name) + "s"}${(input) ? `(condition:$data)` : "" }{\nedges{\nnode{\n${output}}\n}\n}\n}\n`,
            "variables": (input) ? JSON.stringify(input[0]) : ""
          }
        })
      }

  function registerCRUD(name) {
    var graphql = this;
    var mutationName;
    ["update", "create", "delete"].forEach((type) => {
      graphql[type + toTitleCase(name)] = createQuery((output, input) => {
        return {
          "query": `mutation($data:${toTitleCase(type) + toTitleCase(name) + "Input!"}){\n${type + toTitleCase(name)}(input:$data){\n${name.toLowerCase()}{\n${output}}\n}\n}\n`,
          "variables": JSON.stringify(input)
        }
      })
    })
  }

  function createQuery(templateString) {
    return function(inputData, outputData) {
      var data;
      if (inputData) {
        data = {
          data: inputData
        };
      }
      var formattedOutput = "";

      function formatObject(obj) {
        let tempData = "";
        obj.forEach((element) => {
          if (element.constructor == Array) {
            tempData += formatObject(element);
          } else {
            tempData += element + "\n";
          }
        })
        return `{${tempData}}`;
      }
      outputData.forEach((element) => {
        if (element.constructor == Array) {
          formattedOutput += formatObject(element);
        } else {
          formattedOutput += element + "\n";
        }
      })
      return templateString(formattedOutput, data)
    }
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  return {
    registerCRUD: registerCRUD,
    registerQueries: registerQueries
  }
}
})();
