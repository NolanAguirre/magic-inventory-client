angular
    .module('app')
    .controller('StoresController', storesController);


storesController.$inject = ['httpService', 'GraphqlService', 'TypeaheadService', 'StorageService'];

function storesController(httpService, graphql, typeahead, storage) {
    var vm = this;
    vm.http = httpService;
    vm.setStore = (store)=>{
        storage.addData("activeStore", store);
    }
    vm.typeahead = typeahead;
    httpService.graphql(graphql.allStores({
        data: ["name", "id", "phoneNumber", "email"],
        format: {
            first: 10
        }
    })).then((res) => {
        vm.stores = res.data.data.allStores.edges.map((item) => item = item.node);
    });
}
