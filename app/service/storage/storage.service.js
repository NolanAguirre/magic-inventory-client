(function() {

    'use strict';

    angular
        .module('app')
        .service('StorageService', storageService);


    function storageService() {
        var data = {};
        class compressedCardList {
            constructor() {
                this.items = [];
            }
            get total() {
                let total = 0;
                this.items.forEach((element) => {
                    total += element.price * element.quantity
                });
                return total;
            }
            get list() {
                return this.items
            }
            add(card) {
                function equalTo(element){
                    return card.cardId == element.cardId &&
                           card.condition == element.condition &&
                           card.price == element.price;
                }
                if (this.items.filter(equalTo).length > 0) {
                    let temp = this.items.filter(equalTo)[0]
                    temp.id.push(card.id[0]);
                    temp.quantity++;
                } else {
                    card.quantity = 1;
                    this.items.push(card);
                }
            }
            remove(card) {
                let tempCard = Object.assign({}, card);
                tempCard.id = [card.id.pop()];
                card.quantity--;
                if (card.quantity == 0) {
                    this.items = this.items.filter((element) => {
                        return element != card
                    });
                }
                tempCard.quantity = 1;
                return tempCard;
            }
        }

        function addData(key, value) {
            data[key] = value;
        }
        return {
            compressedCardList: compressedCardList,
            addData: addData,
            data: data
        }
    }
})();
