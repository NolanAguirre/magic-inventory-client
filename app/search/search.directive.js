(function() {

  'use strict';

  angular
    .module('app')
    .directive('search', search);

  function search() {
    return {
      templateUrl: 'app/search/search.html',
      controller: searchController,
      controllerAs: 'vm'
    }
  }

  searchController.$inject = ['$http', 'CartService', 'httpService', '$scope'];

  function searchController($http, cartService, httpService, $scope) {
    var vm = this;
    vm.cart = cartService;
    vm.searchResults = []
    var API_URL = 'http://localhost:3001/api';

    vm.typeahead = httpService.createRequest('http://localhost:5000/graphql', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    data => {return data.data.typeahead.edges.map(a => a.node)},
    data => {return urlencoded(`{typeahead(argCardName:"${data}"){edges{node}}}`)}
  )
    vm.queryCard = function(foo, bar) { // name or set code and collectorsNumber
      var data = {
        name: foo,
        collectorsNumber: bar
      };
      vm.searchResult = httpService.queryCard(data);
    }
  }
})();
