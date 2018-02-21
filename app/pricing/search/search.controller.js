angular
    .module('app')
    .controller('SearchController', searchController);

searchController.$inject = ['$http', 'CartService', 'httpService', '$scope'];

function searchController($http, cartService, httpService, $scope) {
    var vm = this;
    vm.cart = cartService;
    var API_URL = 'http://localhost:3001/api';
    vm.typeahead = function(cardName) {
        let queryParams = {
            queryParams: {
                name: cardName
            }
        }
        return httpService.typeahead(queryParams);
    }
    vm.queryCard = function() {
        console.log("querying card")
        let queryParams = {
            queryParams: {
                name: vm.queryParams
            }
        } // this is temoporary
        httpService.queryCard(queryParams).then(
            function(data) {
                cartService.searchResults = data.map(function(card) {
                    card.quantityInStock = {
                        regular: 2,
                        foil: 4
                    }
                    card.quantityInCart = {
                        regular: 0,
                        foil: 0
                    }
                    httpService.queryCardPrice(card).then(
                        function(price){
                            console.log(price);
                            card.price = {
                            regular: price,
                            foil: 1
                        };
                    }).catch(function(err){
                        card.price = {
                            regular: card.url,
                            foil: 1
                        };
                    })

                    return card;
                });

            })
    }

}
