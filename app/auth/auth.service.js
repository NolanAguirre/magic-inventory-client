(function() {

    'use strict';

    angular
        .module('app')
        .service('authService', authService);

    authService.$inject = ['$state', '$timeout', 'httpService', 'GraphqlService'];

    function authService($state, $timeout, httpService, graphql) {

        var userProfile;
        var role;
        var id;

        function login(email, password) {
            return httpService.graphql(graphql.fragment(`
                mutation{
	                   authenticate(input:{arg0:"${email}", password:"${password}"}){
                           jwtTokenType
                       }
                   }
                `)).then((res) => {
                localStorage.setItem('access_token', res.data.data.authenticate.jwtTokenType);
                getRole();
                getId();
            })
        }

        function setSession(authResult) {

            // Set the time that the access token will expire at
            //let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            // localStorage.setItem('access_token', authResult.accessToken);
            // localStorage.setItem('id_token', authResult.idToken);
            // localStorage.setItem('expires_at', expiresAt);
        }

        function getRole() {
            if (role) {
                return role;
            } else if (localStorage.getItem('access_token')) {
                role = httpService.graphql(graphql.fragment(`
                    {
                        getRole
                    }
                    `)).then((res) => {
                    return res.data.data.getRole
                })
                return role;
            }
            return null;
        }

        async function getId() {
            if (id) {
                return id;
            }else if(localStorage.getItem('access_token')){
                id = await httpService.graphql(graphql.fragment(`
                    {
                        getId
                    }
                `));
                return id.data.data.getId;
            }
            return null;
        }

        function getProfile() {
            var accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                throw new Error('Access token must exist to fetch profile');
            } else {
                getRole();
            }
        }

        function setUserProfile(profile) {
            userProfile = profile;
        }

        function getCachedProfile() {
            return userProfile;
        }


        function logout() {
            // Remove tokens and expiry time from localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('id');
            localStorage.removeItem('expires_at');
            localStorage.removeItem('role');
            localStorage.removeItem('store');
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
            return role == 'MAGIC_INVENTORY_EMPLOYEE';
        }

        function isOwner() {
            return role == 'MAGIC_INVENTORY_STORE_OWNER';
        }
        return {
            login: login,
            getProfile: getProfile,
            logout: logout,
            getId: getId,
            isAuthenticated: isAuthenticated,
            isAdmin: isAdmin,
            isOwner: isOwner,
            getRole: getRole
        }
    }
})();
