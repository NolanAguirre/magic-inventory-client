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
    function testAuth(){
      return $http.post('http://localhost:3002/', {});
    }
    function graphql(data, token){
        let accessToken = localStorage.getItem('access_token') || token;
        if(!accessToken){
            return $http.post('http://localhost:3002/graphql', data);
        }else{
            return $http.post('http://localhost:3002/graphql', data, {headers:{"Authorization": `Bearer ${accessToken}`}});
        }
    }
    function getPrice(data){
      return $http.post(`http://localhost:3003`, data);
    }
    return {
      createRequest: createRequest,
      graphql: graphql,
      testAuth: testAuth,
      getPrice: getPrice
    }
  }
})();
