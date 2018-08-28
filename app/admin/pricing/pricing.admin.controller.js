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
            vm.searchResults = res.data.data.allCards.edges.map((card) => {
                card = card.node;
                let tempCard = {
                    condition: card.condition,
                    setName: card.setName,
                    name: card.name
                }
                http.getPrice(tempCard).then((res) => {
                    card.price = res.data;
                }).catch((err) => {
                    card.price = "Failed to fetch";
                });
                return card;
            })
        })
    }

}
