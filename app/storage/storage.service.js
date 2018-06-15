angular
  .module('app')
  .service('StorageService', storageService);


function storageService() {
  var storage = this;
  storage.data = {};
  storage.addData = (key, value) => {
    storage.data[key] = value;
  }
}
