(function() {

  'use strict';

  angular
    .module('app')
    .service('httpService', httpService);

  httpService.$inject = ['$http'];

  function httpService($http) {
    function createRequest(url, config, callback, inputDataFormater) {
      return function(data) {
        if(inputDataFormater){
          data.query = inputDataFormater(data.query);
        }
        return $http.post(url, data.query, config).then(function(res){
            return callback(data.view, res.data);
        }, function(err){
          return err;
        })
      }
    }
    return {
      createRequest: createRequest
    }
  }
})();
