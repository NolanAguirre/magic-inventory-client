angular
    .module('app')
    .controller('SearchController', searchController);

searchController.$inject = ['$http', 'CartService'];

function searchController($http, cartService) {
    var vm = this;
    vm.cart = cartService;
    var API_URL = 'http://localhost:3001/api';
    vm.typeahead = function(cardName) {
        return $http.post('http://localhost:3001/api/typeahead',{
            queryParams: {
                name: cardName
            }
        }).then(function(response) {
            return response.data.map(function(item) {
                return item.name;
            });
        });
    }
    vm.queryCard = function() {
        console.log("querying card")
        let queryParams = {
            queryParams: {
                name: vm.queryParams
            }
        } // this is temoporary
        $http.post("http://localhost:3001/api/search", queryParams)
            .then(function(res) {
                console.log(res.data);
                cardDataFormatter(res.data)
                vm.cart.searchResults = res.data;
            }, function(err) {
                console.log(err);
            })
    }

    function queryCardPrice(card) {
        console.log("querying card price");
        if (card.url) {
            $http.get(card.url).then(
                function(res) {
                    card.price.regular = res.data.price;
                    console.log("query complete");
                },
                function(err) {
                    console.log(err);
                })
        }
    }

    function cardDataFormatter(cards) { // this is temoporary because the database is only half setup
        cards.forEach(function(card) {
            card.quantityInStock = {
                regular: 2,
                foil: 4
            }
            card.quantityInCart = {
                regular: 0,
                foil: 0
            }
            card.price = {
                regular: 1,
                foil: 1
            }
            queryCardPrice(card);
        })
    }
}
