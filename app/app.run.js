(function() {

    'use strict';

    angular
      .module('app')
      .run(run);

    run.$inject = ['authService', 'httpService', "GraphqlService", "StorageService"];

    function run(authService, httpService, graphqlService, storage) {
      //authService.getRole();
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
      storage.addData("storeId", "82c55e16-1895-47a9-95ac-e547e3641504");
    }
  })();
