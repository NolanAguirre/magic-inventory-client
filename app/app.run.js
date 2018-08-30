(function() {

    'use strict';

    angular
      .module('app')
      .run(run);

    run.$inject = ['authService', 'httpService', "GraphqlService", "StorageService"];

    function run(authService, httpService, graphqlService, storage) {
      authService.getUserProfile();
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
      graphqlService.registerCRUD("admin");
      graphqlService.registerQueries("orderItem");
      graphqlService.registerQueries("cardName");
      graphqlService.registerQueries("cardSet");
    }
  })();
