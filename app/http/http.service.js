 dangular.module('app')
     .service("httpService", httpService);

 httpService.$inject = ['$http'];

 function httpService($http) {
     var http = this;
     var apiUrl = "http://localhost:3001";
     http.get = function(url, successCallback, errorCallback, config) {
         if (!config) {
             $http.get(url).then(successCallback(data), errorCallback(error));
         } else {
             $http.get(url, config).then(successCallback(data), errorCallback(error));
         }

     }
     http.queryCard = function(queryParams, successCallback, errorCallback) {
         $http.put(apiUrl + "/query", queryParams).then(successCallback(data), errorCallback(error));
     }
 }
