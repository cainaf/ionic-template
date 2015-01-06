angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, AuthService, $log, $cordovaFacebook, $ionicPopup, $cordovaPush) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.fbLogin = function() {

    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
      .then(function(success) {
        $log.debug(success);
        $ionicPopup.alert({
           title: 'Success!',
           template: JSON.stringify(success)
         });
        // { id: "634565435",
        //   lastName: "bob"
        //   ...
        // }
      }, function (error) {
        $log.error(error);
        $ionicPopup.alert({
           title: 'Error!',
           template: JSON.stringify(error)
         });
        // error
      });


    // AuthService.facebook.login(['public_profile', 'email'])
    //         .then(function(resp) {
    //           $log.debug(resp);
    //           // $state.go('<insert stateName to go too after login>');
    //         })
    //         .catch(function(err) {
    //             $log.error(err);
    //         });

  };

  $scope.info = function() {
    $cordovaFacebook.api("me", ["public_profile"])
    .then(function(success) {
        $log.debug(success);
        $ionicPopup.alert({
           title: 'Success!',
           template: JSON.stringify(success)
         });
    }, function (error) {
        $log.error(error);
        $ionicPopup.alert({
           title: 'Error!',
           template: JSON.stringify(error)
         });
    });


  
  };

  $scope.status = function() {
    $cordovaFacebook.getLoginStatus()
     .then(function(success) {
        $log.debug(success);
        $ionicPopup.alert({
           title: 'Success!',
           template: JSON.stringify(success)
         });
    }, function (error) {
        $log.error(error);
        $ionicPopup.alert({
           title: 'Error!',
           template: JSON.stringify(error)
         });
    });
  };

  $scope.logout = function() {
    $cordovaFacebook.logout()
     .then(function(success) {
        $log.debug(success);
        $ionicPopup.alert({
           title: 'Success!',
           template: JSON.stringify(success)
         });
    }, function (error) {
        $log.error(error);
        $ionicPopup.alert({
           title: 'Error!',
           template: JSON.stringify(error)
         });
    });
  };  

  $scope.pushInfo = function() {

    // var iosConfig = {
    //   "badge": "true",
    //   "sound": "true",
    //   "alert": "true"
    // };

    var androidConfig = {
      "senderID": "618652915093",
    };

    $cordovaPush.register(androidConfig).then(function(result) {
      // Success -- send deviceToken to server, and store for future use
      console.log("result: " + result);
      $ionicPopup.alert({
           title: 'result!',
           template: JSON.stringify(result)
         });
      // $http.post("http://server.com/tokens", {user: "Bob", tokenID : result.deviceToken);
    }, function(err) {
      console.log("err: " + err);
      $ionicPopup.alert({
           title: 'err!',
           template: JSON.stringify(err)
         });
    });

    $rootScope.$on('pushNotificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            console.log('registration ID = ' + notification.regid);
            alert('registration ID = ' + notification.regid);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });

  };

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
 

 // auth
var module = angular.module('api.auth', [
    'angular-data.DS',
    'ngCordova'
]);

module.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

module.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
});

module.service('ApiAuthService', function(DS, $q, $http) {
    var apiBaseUrl = DS.defaults.baseUrl;

    function login(credentials) {
        var deferred = $q.defer();

        $http.post(apiBaseUrl + '/login', credentials, { 'withCredentials': true })
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    }

    function register(credentials) {
        var q = $q.defer();
        $http.post(apiBaseUrl + '/register', credentials)
            .success(q.resolve)
            .error(q.reject);

        return q.promise;
    }

    function exchangeAccessToken(data) {
      var q = $q.defer();

      $http.post(apiBaseUrl + '/auth/' + data.provider + '/token', data)
        .success(q.resolve)
        .error(q.reject);

      return q.promise;
    }

    return {
        'login': login,
        'register': register,
        'exchangeAccessToken': exchangeAccessToken
    };
});

module.service('AuthService', function ($cordovaFacebook, ApiAuthService, $q, $localStorage) {
    function setLocalStorage(provider, user, token) {
        $localStorage.provider = provider;
        $localStorage.token = token;
        $localStorage.user = user;
    }

    function getLocalStorage() {
        return {
            'provider': $localStorage.provider,
            'token': $localStorage.token,
            'user': $localStorage.user
        }
    }

    function handleTokenSuccess(q, provider) {
        return function(data) {
            setLocalStorage.apply(this, [provider, data.user, data.token]);

            q.resolve(getLocalStorage());
        }
    }

    /**
     * Public interface
     *
     * @type {{ facebook: *}}
     */
    var authService = {
        'facebook': (function() {
            var provider = 'facebook';

            return angular.extend({}, $cordovaFacebook, {
                'login': function (permissions) {
                    var deferred = $q.defer();

                    $cordovaFacebook.login(permissions)
                        .then(function(response) {
                            return ApiAuthService.exchangeAccessToken({
                                'provider': provider,
                                'access_token': response.authResponse.accessToken,
                                'exp': response.authResponse.expiresIn
                            });
                        })
                        .then(handleTokenSuccess(deferred, provider))
                        .catch(deferred.reject);

                    return deferred.promise;
                }
            })
        })()
    };

    authService.isAuthenticated = function () {
        return !!$localStorage.user;
    };

    return authService;
});
