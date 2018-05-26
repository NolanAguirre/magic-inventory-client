(function() {

  'use strict';

  angular
    .module('app')
    .service('httpService', httpService);

  httpService.$inject = ['$http'];

  function httpService($http) {
    function createRequest(url, callback) {
      return function(view, data) {
        return $http.post(url, data).then(function(res){
            return callback(view, res.data);
        }, function(err){
          return err;
        })
      }
    }
    function graphql(data){
      return $http.post('http://localhost:3001/graphql', data);
    }
    return {
      createRequest: createRequest,
      graphql, graphql
    }
  }
})();
