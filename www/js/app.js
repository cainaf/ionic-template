// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'api.auth', 'ngStorage'])

.run(function($ionicPlatform, $rootScope, $cordovaPush, $ionicPopup, $cordovaLocalNotification) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  // ios
    // var iosConfig = {
    //   "badge": "true",
    //   "sound": "true",
    //   "alert": "true"
    // };

    var androidConfig = {
      "senderID": "618652915093"
    };

    $rootScope.$on('pushNotificationReceived', function(event, notification) {
      console.log(event);
      console.log(notification);
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            console.log('registration ID = ' + notification.regid);
            alert('registration ID = ' + notification.regid);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          // alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          $cordovaLocalNotification.add({
            id: 'some_notification_id',
            title: 'Opa',
            message: 'Beleza?'
            // parameter documentation:
            // https://github.com/katzer/cordova-plugin-local-notifications#further-informations-1
          }).then(function () {
            console.log('callback for adding background notification');
          });
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });

    $cordovaPush.register(androidConfig).then(function(result) {
      // Success -- send deviceToken to server, and store for future use
      console.log("result: " + result);
    //   $ionicPopup.alert({
    //        title: 'result!',
    //        template: JSON.stringify(result)
    //      });
    //   // $http.post("http://server.com/tokens", {user: "Bob", tokenID : result.deviceToken);
    // }, function(err) {
    //   console.log("err: " + err);
    //   $ionicPopup.alert({
    //        title: 'err!',
    //        template: JSON.stringify(err)
    //      });
    });

  });
})

// .config(function ($cordovaFacebookProvider) {
  // ionic.Platform.ready(function() {
  //   $cordovaFacebookProvider.browserInit('422107874609883', '2.2');
  // });
// })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
