(function() {

    'use strict';

    angular
        .module('app')
        .service('httpService', httpService);

    httpService.$inject = ['$http'];

    function httpService($http) {

        function queryCard(queryParams) {
            return $http.post("http://localhost:3001/api/search", queryParams)
                .then(function(res) {
                    return res.data;
                }, function(err) {
                    console.log(err);
                    return null;
                })
        }

        function queryCardPrice(card, isFoil) {
            let tempCard =  Object.assign({}, card);
            tempCard.foil = isFoil;
            return $http.post("http://localhost:3002/", tempCard).then(
                function(res) {
                    return res.data;
                }).catch(function(err){
                    return err;
                })
        }

        function typeahead(queryParams) {
            return $http.post('http://localhost:3001/api/typeahead', queryParams)
                .then(function(response) {
                    return response.data.map(function(item) {
                        return item.name;
                    });
                });
        }
        return {
            queryCard: queryCard,
            queryCardPrice: queryCardPrice,
            typeahead: typeahead
        }
    }
})();
