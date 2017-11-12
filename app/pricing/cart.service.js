angular.module('app')
    .service("CartService", cartService);

function cartService() {
    var cart = this;
    cart.items = [
    ];
    cart.searchResults = [
        {
            "name": "AWOL",
            "multiverseid": 74231,
            "price": {
                "regular": 6.87,
                "foil": 13.44
            },
            "quantityInStock": {
                "regular": 2,
                "foil": 4
            },
            "quantityInCart": {
                "regular": 0,
                "foil": 0
            }
        },
        {
            "name": "Letter bomb",
            "multiverseid": 74232,
            "price": {
                "regular": 2.45,
                "foil": 5.34
            },
            "quantityInStock": {
                "regular": 2,
                "foil": 4
            },
            "quantityInCart": {
                "regular": 0,
                "foil": 0
            }
        }
    ];
    cart.total = 0;
    cart.clear = function() {
        cart.items = [];
    }
    cart.add = function(card) {
        if(cart.items.includes(card)){
            var item = cart.items.find(function(element){
                return card == element;
            })
            if(item.quantityInCart.regular < item.quantityInStock.regular){
                item.quantityInCart.regular++;
            }
        }else{
            card.quantityInCart.regular++
            cart.items.push(card);
        }
        cart.updatePrice();
    }
    cart.remove = function(card) {

    }
    cart.updatePrice = function(){
        cart.total = 0;
        cart.items.forEach(function(item){
            cart.total += item.quantityInCart.regular * item.price.regular + item.quantityInCart.foil * item.price.foil;
        })
    }
}
