(function() {

  'use strict';

  angular
    .module('app')
    .service('httpService', httpService);

  httpService.$inject = ['$http'];

  function httpService($http) {
    function createRequest(url,config, callback, inputDataFormater) {
      return function(data) {
        if(inputDataFormater){
          data = inputDataFormater(data);
        }
        return $http.post(url, data, config).then(function(res){
            return callback(res.data);
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
