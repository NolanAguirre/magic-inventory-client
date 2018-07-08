angular
    .module('app')
    .service('StorageService', storageService);


function storageService() {
    var storage = this;
    storage.compressedCardList = class{
        constructor(){
            this.items = [];
        }
        get total(){
            let total = 0;
            this.items.forEach((element)=>{
                total += element.price * element.quantity
            });
            return total;
        }
        get list(){
            return this.items
        }
        add(card){
            if(this.items.filter((element) =>{
                return card.name == element.name && card.set == element.set && card.condition == element.condition
            }).length > 0){
                let tempCard = this.items.filter((element) =>{
                    return card.name == element.name && card.set == element.set && card.condition == element.condition
                })[0];
                tempCard.id.push(card.id[0]);
                tempCard.quantity++;

            }else{
                card.quantity = 1;
                this.items.push(card);
            }
        }
        remove(card){
            let tempCard = Object.assign({}, card);
            tempCard.id = [card.id.pop()];
            card.quantity--;
            if(card.quantity == 0){
                this.items = this.items.filter((element)=>{return element != card});
            }
            tempCard.quantity = 1;
            return tempCard;
        }
    }
    storage.data = {};
    storage.addData = (key, value) => {
        if (storage.data[key]) {
            //if the key exists do nothing
        } else {
            storage.data[key] = value;
        }
    }
}
