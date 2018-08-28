(function() {

    'use strict';

    angular
        .module('app')
        .service('authService', authService);

    authService.$inject = ['$state', '$timeout', 'httpService', 'GraphqlService', 'StorageService'];

    function authService($state, $timeout, httpService, graphql, storage) {
        let profile;
        function login(email, password) {
            return httpService.graphql(graphql.fragment(`
                mutation{
	                   authenticate(input:{arg0:"${email}", password:"${password}"}){
                           jwtTokenType
                       }
                   }
                `)).then((res) => {
                console.log(res)
                localStorage.setItem('access_token', res.data.data.authenticate.jwtTokenType);
                getUserProfile();
            })
        }
        async function getUserProfile() {
            if(profile){
                return profile;
            }
            if (localStorage.getItem('access_token')) {
                let result = await httpService.graphql(
                    graphql.fragment(`
                    {
	                    getUserData{
                            lastName
                            firstName
                            role
                            store
                            expiresAt
  	                        id
                         }
                     }
                `))
                profile = result.data.data.getUserData;
                console.log(profile);
                return profile;
            }
        }

        function setSession(authResult) {

            // Set the time that the access token will expire at
            //let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            // localStorage.setItem('access_token', authResult.accessToken);
            // localStorage.setItem('id_token', authResult.idToken);
            // localStorage.setItem('expires_at', expiresAt);
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
            return localStorage.getItem('access_token') != null;
        }

        function isAdmin() {
            if(!profile){
                return false;
            }
            return isAuthenticated()
                   && profile.role == 'MAGIC_INVENTORY_EMPLOYEE'
                   || isOwner();
        }

        function isOwner() {
            if(!profile){
                return false;
            }
            return  isAuthenticated() && profile.role == 'MAGIC_INVENTORY_STORE_OWNER';
        }
        return {
            login: login,
            logout: logout,
            getUserProfile: getUserProfile,
            isAuthenticated: isAuthenticated,
            isAdmin: isAdmin,
            isOwner: isOwner
        }
    }
})();
