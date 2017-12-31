angular
  .module('app')
  .controller('SearchController', searchController);

searchController.$inject = ['$http', 'CartService'];

function searchController($http, cartService) {
  var vm = this;
  vm.cart = cartService;
  var API_URL = 'http://localhost:3001/api';
  vm.queryCard = function() {
    console.log("querying card")
    let queryParams = {
      queryParams:{
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

  function queryCardPrice(url) {
    if (url) {
      return 5;
      // return setTimeout($http.put(url).then(function(data) {
      //   return data;
      // }, function(err) {
      //   return err;
      // }))
    }
    return null;
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
        regular: queryCardPrice(card.url),
        foil: queryCardPrice(card.url)
      }
    })
  }
}
