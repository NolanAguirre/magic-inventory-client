angular
    .module('app')
    .controller('AdminPricingController', adminPricingController)

adminPricingController.$inject = ['httpService', 'GraphqlService', 'StorageService']

function adminPricingController(http, graphql, storage) {
    var vm = this;
    vm.query = function() {
        http.graphql(graphql.allCards({
            data: ['id', 'name', 'setName', 'setCode', 'multiverseId']
        }, {
            condition: {
                name: vm.queryResult
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

    vm.typeahead = function(name) {
        return http.graphql(graphql.allCardNames({
            data: ['name'],
            format:{
                first:10
            }
        },{
            filter:{
                name:{
                    startsWith:name
                }
            }
        })).then((res) => {
            return res.data.data.allCardNames.edges.map((element) => {
                return element.node.name
            })
        })
    }
}
