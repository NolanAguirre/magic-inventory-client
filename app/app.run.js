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
      storage.addData("storeId", "2a03fabf-dc41-4f1c-a6be-23a0f6ad77a1");
    }
  })();
