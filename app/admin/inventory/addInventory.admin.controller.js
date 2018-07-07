angular
    .module('app')
    .controller('AdminAddInventoryController', adminAddInventoryController)

adminAddInventoryController.$inject = ["httpService", "GraphqlService", "StorageService"];

function adminAddInventoryController(http, graphql, storage) {
    var vm = this;
    vm.addByName = {
        typeahead: (name) => {
            let query;
            if (vm.addBySet.queryResult) {
                query = graphql.allCards({
                    data: ['name'],
                    format: {
                        first: 10
                    }
                }, {
                    filter: {
                        name: {
                            startsWith: name
                        },
                        setName: {
                            equalTo: vm.addBySet.queryResult
                        }
                    }
                })
            } else {
                query = graphql.allCardNames({
                    data: ['name'],
                    format: {
                        first: 10
                    }
                }, {
                    filter: {
                        name: {
                            startsWith: name
                        }
                    }
                })
            }
            return http.graphql(query).then((res) => {
                return res.data.data[Object.keys(res.data.data)[0]].edges.map((element) => {
                    return element.node.name
                })
            })
        }
    };
    vm.addBySet = {
        typeahead: (name) => {
            return http.graphql(graphql.allCardSets({
                data: ['setName'],
                format: {
                    first: 10
                }
            }, {
                filter: {
                    setName: {
                        startsWith: name
                    }
                }
            })).then((res) => {
                return res.data.data.allCardSets.edges.map((element) => {
                    return element.node.setName
                })
            })
        }
    };
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
                })).then((data) => {
                    console.log(data)
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
            vm.searchResults = res.data.data.allCards.edges.map((element) => {
                element.node.isCreatingInventory = true;
                element.node.condition = "LIGHTLY_PLAYED"
                return element.node;
            })
        })
    }
}
