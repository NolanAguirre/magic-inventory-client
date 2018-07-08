angular
    .module('app')
    .service('StorageService', storageService);


function storageService() {
    var storage = this;
    storage.data = {};
    storage.addData = (key, value) => {
        if (storage.data[key]) {
            //if the key exists do nothing
        } else {
            storage.data[key] = value;
        }
    }
}
