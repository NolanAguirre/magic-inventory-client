angular
    .module('app')
    .service('AuthService', authService);

authService.$inject = ['$state', '$timeout'];

function authService($state, $timeout) {
    var userProfile;
    var webAuth = new auth0.WebAuth({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        responseType: 'token id_token',
        audience: AUTH0_AUDIENCE,
        scope: 'openid',
        redirectUri: window.location.href
    });

    function login() {
        webAuth.authorize();
    }

    function handleAuthentication() {
        webAuth.parseHash(function(err, authResult) {
            if (authResult && authResult.idToken) {
                setSession(authResult);
                $state.go('home');
            } else if (err) {
                $timeout(function() {
                    $state.go('home');
                });
                console.log(err);
                alert('Error: ' + err.error + '. Check the console for further details.');
            }
        });
    }

    function getProfile(callback) {
        var accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token must exist to fetch profile');
        }
        angularAuth0.client.userInfo(accessToken, function(err, profile) {
            if (profile) {
                setUserProfile(profile);
            }
            callback(err, profile);
        });
    }

    function setUserProfile(profile) {
        userProfile = profile;
    }

    function getCachedProfile() {
        return userProfile;
    }

    function setSession(authResult) {
        // Set the time that the access token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        $state.go('home');
    }

    function isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        // let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        // return new Date().getTime() < expiresAt;
        return false;
    }
    return {
        login: login,
        getProfile: getProfile,
        getCachedProfile: getCachedProfile,
        handleAuthentication: handleAuthentication,
        logout: logout,
        isAuthenticated: isAuthenticated
    }
}
