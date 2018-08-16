(function() {

    'use strict';

    angular
        .module('app')
        .service('authService', authService);

    authService.$inject = ['$state', '$timeout', 'httpService', 'GraphqlService', 'StorageService'];

    function authService($state, $timeout, httpService, graphql, storage) {
        function login(email, password) {
            return httpService.graphql(graphql.fragment(`
                mutation{
	                   authenticate(input:{arg0:"${email}", password:"${password}"}){
                           jwtTokenType
                       }
                   }
                `)).then(async (res) => {
                localStorage.setItem('access_token', res.data.data.authenticate.jwtTokenType);
                getUserProfile();
            })
        }
        async function getUserProfile(){
            await getRole();
            await getId();
            if(isAdmin()){
                await getStore();
            }
        }
        function setSession(authResult) {

            // Set the time that the access token will expire at
            //let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            // localStorage.setItem('access_token', authResult.accessToken);
            // localStorage.setItem('id_token', authResult.idToken);
            // localStorage.setItem('expires_at', expiresAt);
        }

        async function getRole() {
            if (storage.data.userProfile.role) {
                return storage.data.userProfile.role;
            } else if (localStorage.getItem('access_token')) {
                let role = await httpService.graphql(graphql.fragment(`
                    {
                        getRole
                    }
                    `));
                storage.data.userProfile.role = role.data.data.getRole
                return role;
            }
            return null;
        }

        async function getId() {
            if (storage.data.userProfile.id) {
                return storage.data.userProfile.id;
            }else if(localStorage.getItem('access_token')){
                let id = await httpService.graphql(graphql.fragment(`
                    {
                        getId
                    }
                `));
                storage.data.userProfile.id = id.data.data.getId;
                return id;
            }
            return null;
        }
        async function getStore() {
            if (storage.data.userProfile.store) {
                return storage.data.userProfile.store;
            }else if(localStorage.getItem('access_token')){
                let store = await httpService.graphql(graphql.fragment(`
                    {
                        getAdminStore
                    }
                `));
                console.log(store);
                storage.data.userProfile.store = store.data.data.getAdminStore;
                return store;
            }
            return null;
        }

        function logout() {
            // Remove tokens and expiry time from localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('id');
            localStorage.removeItem('expires_at');
            localStorage.removeItem('role');
            localStorage.removeItem('store');
            storage.data.userProfile = {};
            //$state.go('home');
        }

        function isAuthenticated() {
            // Check whether the current time is past the
            // access token's expiry time
            // let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
            // return new Date().getTime() < expiresAt;
            return localStorage.getItem('access_token');
        }

        function isAdmin() {
            return storage.data.userProfile.role == 'MAGIC_INVENTORY_EMPLOYEE' || isOwner();
        }

        function isOwner() {
            return storage.data.userProfile.role == 'MAGIC_INVENTORY_STORE_OWNER';
        }
        return {
            login: login,
            logout: logout,
            getId: getId,
            getUserProfile: getUserProfile,
            isAuthenticated: isAuthenticated,
            isAdmin: isAdmin,
            isOwner: isOwner,
            getRole: getRole
        }
    }
})();
