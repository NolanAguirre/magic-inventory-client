(function() {

  'use strict';

  angular
    .module('app')
    .service('GraphqlService', graphqlService);

  graphqlService.$inject = [];

  function graphqlService() {
    function registerQueries(name) {
      var pluralName = name;
      if (name.substring(name.length - 1) == "y") {
        pluralName = name.slice(0, -1) + "ie";
      }
      this["all" + toTitleCase(pluralName) + "s"] = createQuery((output, input) => {
        return {
          "query": `query ($condition:${toTitleCase(name) + "Condition"}, $filter:${toTitleCase(name) + "Filter"}){\n${"all" + toTitleCase(pluralName) + "s"}(condition:$condition, filter:$filter ${output.format ? ","+output.format : ""}) {\ntotalCount\npageInfo{\nstartCursor\nendCursor\n}\nedges{\nnode{\n${output.data}}\n}\n}\n}\n`,
          "variables": (input) ? JSON.stringify(input) : ""
        }
      })
    }
    function registerCRUD(name) {
      var graphql = this;
      var mutationName;
      ["update", "create", "delete"].forEach((type) => {
        graphql[type + toTitleCase(name)] = createQuery((output, input) => {
          return {
            "query": `mutation($input:${toTitleCase(type) + toTitleCase(name) + "Input!"}){\n${type + toTitleCase(name)}(input:$input){\n${name}{\n${output.data}}\n}\n}\n`,
            "variables": JSON.stringify(input)
          }
        })
      })
    }
    function fragment(query){
      return {
        "query" : query
      }
    }
    function createQuery(templateString) {
      return function(outputData, inputData) {
        var formattedOutput = {
          format: "",
          data: ""
        };

        function formatObject(obj) {
          let tempData = "";
          let tempName = Object.keys(obj)[0];
          obj[tempName].forEach((element) => {
            if (element instanceof Object) {
              tempData += formatObject(element);
            } else {
              tempData += element + "\n";
            }
          })
          if (tempName.split("By")[0].endsWith("s")) {
            return `${tempName}{\nedges{\nnode{\n${tempData}}\n}\n}\n`
          }
          return `${tempName}{\n${tempData}}\n`;
        }

        function formatFormatObject(key, obj) {
          for (var foo in obj) {
            if (obj instanceof Object) {
              return key + ":{" +formatFormatObject(foo, obj[foo]) + '}';
            }else{
              return `${key}:${JSON.stringify(obj)}`
            }
          }
        }
        outputData.data.forEach((element) => {
          if (element instanceof Object) {
            formattedOutput.data += formatObject(element);
          } else {
            formattedOutput.data += element + "\n";
          }
        })
        if (outputData.format) {
          for (var key in outputData.format) {
            if (outputData.format[key] instanceof Object) {
              formattedOutput.format += formatFormatObject(key, outputData.format[key]) + "}";
            } else {
              formattedOutput.format += key + ":" + outputData.format[key] + ",";
            }
          }
          formattedOutput.format = formattedOutput.format.slice(0, -1)
        }
        return templateString(formattedOutput, inputData);
      }
    }

    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
      });
    }

    return {
      registerCRUD: registerCRUD,
      registerQueries: registerQueries,
      fragment: fragment
    }
  }
})();
