angular
    .module('app')
    .controller('AdminAddInventoryController', adminAddInventoryController)

adminAddInventoryController.$inject = ["httpService", "GraphqlService", "StorageService", "TypeaheadService","$scope"];

function adminAddInventoryController(http, graphql, storage, typeahead, $scope) {
    var vm = this;
    vm.typeahead = typeahead;
    $scope.$watch('vm.cardSetName',()=>{typeahead.setCardSet(vm.cardSetName);})
    vm.addInventory = function(card) {
        if (card.id && card.condition) {
            for (var x = 0; x < card.quantity; x++) {
                http.graphql(graphql.createInventory({
                    data: ["id"]
                }, {
                    input: {
                        inventory:{
                            cardId: card.id,
                            storeId: storage.data.storeId,
                            condition: card.condition,
                            price: card.price,
                            status: "AVAILABLE"
                        }
                    }
                })).then((res) => {
                    console.log(res)
                })
            }
        }
    }
    vm.queryCard = function(name, set) {
        let condition = {
            "name":name,
            "setName":set
        }
        for(var key in condition){
            if(!condition[key]){
                delete condition[key]
            }
        }
        http.graphql(graphql.allCards({
            data: ['id', 'name', 'setName', 'setCode', 'multiverseId']
        }, {
            "condition": condition
        })).then((res) => {
            console.log(res)
            vm.searchResults = res.data.data.allCards.edges.map((element) => {
                element.node.condition = "LIGHTLY_PLAYED"
                return element.node;
            })
        })
    }
}
