angular
    .module('app')
    .service('TypeaheadService', typeaheadService);

typeaheadService.$inject = ["httpService", "GraphqlService", "StorageService"]

function typeaheadService(http, graphql, storage) {
    var typeahead = this;
    typeahead.cardSetName = {
        query: (name) => {
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
    }
    typeahead.cardName = {
        query: (name) => {
            return http.graphql(graphql.allCardNames({
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
            })).then((res) => {
                return res.data.data.allCardNames.edges.map((element) => {
                    return element.node.name
                })
            })
        }
    }
    typeahead.inventoryName = {
        query: (name) => {
            return http.graphql(graphql.fragment(`
            {
              inventoryTypeahead(argOne:"${name + "%"}", argTwo:"${storage.data.storeId}"){
                edges{
                  node
                }
              }
            }
          `)).then((res) => {
                return res.data.data.inventoryTypeahead.edges.map((element) => {
                    return element.node
                })
            })
        }
    }
    typeahead.cardNameBySet = {
        query: (name) => {
            let query;
            if (typeahead.cardSet) {
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
                            equalTo: typeahead.cardSet
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
    }
}
