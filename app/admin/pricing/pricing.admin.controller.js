angular
    .module('app')
    .controller('AdminPricingController', adminPricingController)

adminPricingController.$inject = ['httpService', 'GraphqlService', 'StorageService', 'TypeaheadService']

function adminPricingController(http, graphql, storage, typeahead) {
    var vm = this;
    vm.typeahead = typeahead;
    vm.query = function() {
        http.graphql(graphql.allCards({
            data: ['id', 'name', 'setName', 'setCode', 'multiverseId']
        }, {
            condition: {
                name: vm.cardName
            }
        })).then((res) => {
            vm.searchResults = res.data.data.allCards.edges.map((element) => {
                http.getPrice(element.node).then((res) => {
                    element.node.price = res.data
                }).catch((err) => {
                    element.node.price = -1
                });
                element.node.showPrice = true;
                return element.node;
            })
        })
    }

}
