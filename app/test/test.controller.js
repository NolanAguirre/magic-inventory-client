angular
    .module('app')
    .controller('TestController', testController);


testController.$inject = ['httpService', 'GraphqlService', 'authService'];

function testController(http, graphql, auth) {
    var vm = this;
    let conditions = ['mint', 'near_mint', 'lightly_played', 'moderately_played', 'heavely_played', 'damaged']
    vm.createUser = (fn, ln, e, p) => {
        return http.graphql(graphql.fragment(`
        mutation{
            registerUser(input:{firstName:"${fn}", lastName:"${ln}", email:"${e}", password:"${p}"}){
                user{
                    id
                }
            }
        }`))
    }
    vm.createOrder = (storeID, userID, o, p) => {
        http.graphql(graphql.createOrder({
            data: ["id"],
        }, {
            order: {
                storeId: storeID,
                userId: userID,
                orderStatus: o.toUpperCase(),
                price: p
            }
        })).then((data) => {
            console.log(data)
        })
    }
    vm.createStore = (n, e, p, c, s, z) => {
        return http.graphql(graphql.createStore({
            data: ["id"]
        }, {
            input: {
                store: {
                    name: n,
                    email: e,
                    phoneNumber: p,
                    city: c,
                    state: s.toUpperCase(),
                    zipCode: z
                }
            }
        }))
    }
    vm.createInventory = (cId, s, c, p) => {
        http.graphql(graphql.createInventory({
            data: ["id"]
        }, {
            input: {
                inventory: {
                    cardId: cId,
                    storeId: s,
                    condition: c.toUpperCase(),
                    price: p,
                    status: "AVAILABLE"
                }
            }
        })).then((data) => {
            console.log(data)
        })
    }
    vm.createAdmin = (ui, si) => {
        http.graphql(graphql.createAdmin({
            data: ["id"]
        }, {
            input: {
                admin: {
                    userId: ui,
                    storeId: si
                }
            }
        })).then((data) => {
            console.log(data)
        })
    }
    vm.createOrderItem = (n, i) => {
        http.graphql(graphql.createOrderItem({
            data: ["id"]
        }, {
            input: {
                orderItem: {
                    orderId: n,
                    inventoryId: i
                }
            }
        })).then((data) => {
            console.log(data)
        })
    }

    vm.getUser = () => {
        http.graphql(graphql.allUsers({
            data: ["id", 'firstName', 'lastName']
        })).then((res) => {
            vm.users = res.data.data.allUsers.edges;
        })
    }
    vm.getCard = () => {
        return http.graphql(graphql.allCards({
            data: ["id", 'name', 'setName', 'multiverseId'],
            format: {
                first: 30
            }
        })).then((res) => {
            vm.cards = res.data.data.allCards.edges;
        })
    }
    vm.getOrder = () => {
        http.graphql(graphql.allOrders({
            data: ["id", 'storeId', 'userId', 'orderStatus', 'price', 'createdAt']
        })).then((res) => {
            vm.orders = res.data.data.allOrders.edges;
        })
    }
    vm.getStore = () => {
        http.graphql(graphql.allStores({
            data: ['name', 'id', 'email', 'phoneNumber', 'city', 'state', 'zipCode']
        })).then((res) => {
            vm.stores = res.data.data.allStores.edges;
        })
    }
    vm.getInventory = () => {
        http.graphql(graphql.allInventories({
            data: ['id', 'storeId', 'status', 'cardId', {
                cardByCardId: ["name", "setName", "multiverseId"]
            }]
        })).then((res) => {
            vm.inventories = res.data.data.allInventories.edges;
        })
    }
    vm.getOrderItem = () => {
        http.graphql(graphql.allOrderItems({
            data: ['id', 'inventoryId', 'orderId']
        })).then((res) => {
            vm.orderItems = res.data.data.allOrderItems.edges;
        })
    }
    vm.getKeys = (data) => {
        return Object.keys(data);
    }
    vm.populateTestData = (async () => {
        let createUsers = {
            create: (el) => {
                vm.createUser(el.first_name, el.last_name, el.email, el.password).then((res) => {
                    el.id = res.data.data.registerUser.user.id;
                })
            },
            data: [{
                first_name: "nolan",
                last_name: "aguirre",
                email: "nolanaguirre08@gmail.com",
                password: "password"
            }, {
                first_name: "edward",
                last_name: "weston",
                email: "eddyw3@gmail.com",
                password: "thisisedd"
            }, {
                first_name: "lauren",
                last_name: "akuima",
                email: "laurenAkuima@mothershipatx.com",
                password: "password"
            }, {
                first_name: "jacob",
                last_name: "sconty",
                email: "jacob@mothershipatx.com",
                password: "password"
            }]
        }
        let createStores = {
            create: (el) => {
                auth.login(el.owner.email, el.owner.password).then((res) => {
                    http.graphql(graphql.fragment(`
                        mutation{
                            updateRole(input:{arg0:"${el.owner.id}", arg1:MAGIC_INVENTORY_STORE_OWNER}){
                                clientMutationId
                            }
                        }
                        `)).then((resp) => {
                        auth.logout();
                        auth.login(el.owner.email, el.owner.password).then((respo) => {
                            vm.createStore(el.name, el.email, el.phoneNumber, el.city, el.state, el.zipCode).then((respon) => {
                                console.log(respon);
                                el.id = respon.data.data.createStore.id;
                                vm.createAdmin(el.owner.id, el.id);
                            })
                        })
                    })
                })
            },
            data: [{
                name: "Mothership Books And Games",
                email: "mothership@mothershipatx.com",
                phoneNumber: "5126981584",
                city: "Austin",
                state: "Texas",
                zipCode: 78664,
                owner: createUsers.data[2]
            }]
        }
        let createInventory = {
            create: (el) => {
                //auth.logout();
                //auth.login(el.store.owner.email, el.store.owner.password).then((res) => {
                    vm.createInventory(el.cardId, el.store.id, el.condition, el.price);
                //})
            },
            data: [

            ]
        }

        function populateInventoryData() {
            for (var x = 0; x < 10; x++) {
                let temp = {};
                temp.cardId = vm.cards[Math.floor(Math.random() * vm.cards.length)].node.id;
                temp.store = createStores.data[Math.floor(Math.random() * createStores.data.length)];
                temp.condition = conditions[Math.floor(Math.random() * conditions.length)]
                temp.price = 0;
                createInventory.data.push(temp);
            }
        }
        createUsers.data.map((element) => {
            createUsers.create(element);
        });
        setTimeout(() => {
            createStores.data.map((element) => {
                createStores.create(element);
            })
        }, 1000);
        setTimeout(() => {
            vm.getCard().then((res) => {
                populateInventoryData();
                createInventory.data.map((element) => {
                    createInventory.create(element);
                })
            })
        }, 2000);

    })
}
