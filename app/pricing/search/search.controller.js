angular
    .module('app')
    .controller('SearchController', searchController);

searchController.$inject = ['$http', 'CartService', 'httpService', '$scope'];

function searchController($http, cartService, httpService, $scope) {
    var vm = this;
    vm.cart = cartService;
    vm.searchResults = []
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
        }
        httpService.queryCard(queryParams).then(
            function(data) {
                vm.searchResults = data.map(function(card) {
                    card.price = {
                        regular: "",
                        foil: ""
                    };
                    card.quantityInStock = {
                        regular: 1000,
                        foil: 1000
                    }
                    card.quantityInCart = {
                        regular: 0,
                        foil: 0
                    }
                    httpService.queryCardPrice(card, false).then(
                        function(price) {
                            card.price.regular = price;
                        }).catch(function(err) {
                        card.price.regular = card.url;
                    });
                    httpService.queryCardPrice(card, true).then(
                        function(price) {
                            card.price.foil = price;
                        }).catch(function(err) {
                        card.price.foil = card.url;
                    })

                    return card;
                });

            })
    }
}
