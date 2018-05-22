angular.module('app')
    .service("CartService", cartService);

function cartService() {
    var cart = this;
    cart.order = {
        items:[],
        total: 0
    };
    cart.savedOrders = [];
    cart.total = 0;
    cart.clear = function() {
        cart.order.items.forEach(function(item){
            item.quantityInCart = {
                regular: 0,
                foil: 0
            }
        })
        cart.order = {
            items:[],
            total: 0
        };
         cart.isSavedOrder = false;
    }
    cart.deleteOrder = function(order){
        order.items.forEach(function(item){
            item.quantityInCart = {
                regular: 0,
                foil: 0
            }
        })
        order.items = [];
        order.total = 0;
    }
    cart.saveOrder = function(){
        if(!cart.savedOrders.includes(cart.order)){
            cart.savedOrders.push(cart.order);
        }
        cart.order = {
            items:[],
            total: 0
        };
    }
    cart.addRegular = function(card) {
        if(cart.order.items.includes(card)){
            var item = cart.order.items.find(function(element){
                return card == element;
            })
            if(item.quantityInCart.regular < item.quantityInStock.regular){
                item.quantityInCart.regular++;
            }
        }else{
            card.quantityInCart.regular++
            cart.order.items.push(card);
        }
        cart.updatePrice();
    }
    cart.addFoil = function(card){
      if(cart.order.items.includes(card)){
          var item = cart.order.items.find(function(element){
              return card == element;
          })
          if(item.quantityInCart.foil < item.quantityInStock.foil){
              item.quantityInCart.foil++;
          }
      }else{
          card.quantityInCart.foil++
          cart.order.items.push(card);
      }
      cart.updatePrice();
    }
    cart.remove = function(card) {

    }
    cart.updatePrice = function(){
        cart.order.total = 0;
        cart.order.items.forEach(function(item){
            cart.order.total += item.quantityInCart.regular * item.price.regular + item.quantityInCart.foil * item.price.foil;
        })
    }
}
