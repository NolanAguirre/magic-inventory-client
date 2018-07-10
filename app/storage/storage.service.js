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
                if (this.items.filter((element) => {
                        return card.name == element.name && card.setName == element.setName && card.condition == element.condition && element.price == card.price
                    }).length > 0) {
                    let tempCard = this.items.filter((element) => {
                        return card.name == element.name && card.setName == element.setName && card.condition == element.condition && element.price == card.price
                    })[0];
                    tempCard.id.push(card.id[0]);
                    tempCard.quantity++;

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
            if (data[key]) {
                //if the key exists do nothing
            } else {
                data[key] = value;
            }
        }
        return {
            compressedCardList: compressedCardList,
            addData: addData,
            data: data
        }
    }
})();
