(function() {

    'use strict';

    angular
      .module('app')
      .run(run);

    run.$inject = ['authService', 'httpService'];

    function run(authService, httpService) {
      // Handle the authentication
      // result in the hash
      authService.handleAuthentication();
      // httpService.queryCard = httpService.createRequest("http://localhost:5000/graphql", {
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //     }
      //   },
      //   data => {return data.data.allCards.edges.map(a => a.node)},
      //   data => {return urlencoded(data.collectorsNumber ?
      //       `{allCards(condition:{setCode:"${data.name}",collectorsNumber:${data.collectorsNumber}}){edges{node{id,name,setName,tcgId,multiverseId}}}}` :
      //       `{allCards(condition:{name:"${data.name}"}){edges{node{id,name,setName,tcgId,multiverseId}}}}`});
      // );
    }
  })();
