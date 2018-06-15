(function() {

    'use strict';

    angular
      .module('app')
      .run(run);

    run.$inject = ['authService', 'httpService', "GraphqlService", "StorageService"];

    function run(authService, httpService, graphqlService, storage) {
      // Handle the authentication
      // result in the hash
      authService.handleAuthentication();
      graphqlService.registerCRUD("store");
      graphqlService.registerQueries("store");
      graphqlService.registerCRUD("card");
      graphqlService.registerQueries("card");
      graphqlService.registerCRUD("user");
      graphqlService.registerQueries("user");
      graphqlService.registerCRUD("inventory");
      graphqlService.registerQueries("inventory");
      graphqlService.registerCRUD("order");
      graphqlService.registerQueries("order");
      graphqlService.registerCRUD("orderItem");
      graphqlService.registerQueries("orderItem");
      graphqlService.registerQueries("cardName");
      graphqlService.registerQueries("cardSet");
      storage.addData("storeId", "78b72b9c-9e09-419e-a18d-8f2e50ca9593");
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
