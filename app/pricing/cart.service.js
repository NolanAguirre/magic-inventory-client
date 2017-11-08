angular.module('app')
    .service("CartService", cartService);

function cartService(){
    var cart = this;
    cart.items = [];
    cart.total = 0;
    cart.clear = function(){
        cart.items = [];
    }
    cart.add = function(card){
        cart.items.push(card);
        cart.total += card.price;
    }
    cart.remove = function(card){
        
    }
}
