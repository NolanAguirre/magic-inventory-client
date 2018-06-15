(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$state', 'angularAuth0', '$timeout', 'httpService'];

  function authService($state, angularAuth0, $timeout, httpService) {

    var userProfile;
    var role;

    function login() {
      angularAuth0.authorize();
    }

    function handleAuthentication() {
     angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.idToken) {
          setSession(authResult);
          $state.go('home');
          checkRole();
        } else if (err) {
          $timeout(function() {
            $state.go('home');
          });
          console.log(err);
          alert('Error: ' + err.error + '. Check the console for further details.');
        }
      });
    }

    function getProfile(cb) {
      var accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token must exist to fetch profile');
      }
      angularAuth0.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          setUserProfile(profile);
        }
        cb(profile);
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

      // If there is a value on the `scope` param from the authResult,
      // use it to set scopes in the session for the user. Otherwise
      // use the scopes as requested. If no scopes were requested,
      // set it to nothing

      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      localStorage.removeItem('role');
      localStorage.removeItem('store');
      $state.go('home');
    }

    function isAuthenticated() {
      // Check whether the current time is past the
      // access token's expiry time
      // let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      // return new Date().getTime() < expiresAt;
      return true;
    }
    function checkRole(){
        // if (getCachedProfile()) {
        //   httpService.checkRole(authService.getCachedProfile()).then(function(data){
        //       console.log(data);
        //       localStorage.setItem('role', data.role);
        //       role = data.role;
        //       if(data.role != 'user'){
        //           localStorage.setItem('store', data.store);
        //       }
        //   })
        // } else {
        //   getProfile(function(err, profile) {
        //       httpService.checkRole(profile).then(function(data){
        //           console.log(data);
        //           localStorage.setItem('role', data.role);
        //           role = data.role;
        //           if(data.role != 'user'){
        //               localStorage.setItem('store', data.store);
        //           }
        //       })
        //   });
        // }

    }
    function role(){
        return role;
    }
    function isAdmin(){
        return true;
    }
    function isOwner(){
      return false;
    }
    return {
      login: login,
      getProfile: getProfile,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated,
      isAdmin: isAdmin,
      isOwner: isOwner
    }
  }
})();
