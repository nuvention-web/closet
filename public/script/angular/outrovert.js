angular.module('outrovert', ['firebase'])
.factory('firebaseService', ['$firebase', function($firebase) {
  var root = new Firebase('https://sweltering-fire-110.firebaseio.com');
  var firebase = $firebase(root);
  
  return {
    root: function() { return root; },
    get$firebase: function() { return firebase; },
    timestamp: function() { return Firebase.ServerValue.TIMESTAMP; }
  }
}])
.factory('sessionService',  ['firebaseService', '$firebaseSimpleLogin', '$rootScope', function(db, $firebaseSimpleLogin, $rootScope) {

  var root = db.root();
  var firebase = db.get$firebase();
  
  var auth = $firebaseSimpleLogin(root);

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {

    var userData = firebase.$child('users/' + user.uid);

    userData.$on('value', function(snapshot) {
      if(!snapshot.name === user.displayName) 
        userData.$update({displayName: user.displayName});
    });

    var userConnections = userData.$child('connections');
    var lastOnline = userData.$child('lastOnline');

    var con;

    var UA = navigator.userAgent;
    var time = db.timestamp();

    //console.log(con);

    if(!con) userConnections.$add({agent: UA, timestamp: time}).then(function(ref) {
      con = ref.name();
      $rootScope.loggedIn = true;
      $rootScope.displayName = user.displayName;
      $rootScope.profilePicture = 'http://graph.facebook.com/'+user.id+'/picture?type=small';
      $rootScope.profilePictureM = 'http://graph.facebook.com/'+user.id+'/picture';
    });

    $rootScope.disconnect = function() {
      if(con) userConnections.$remove(con);
      lastOnline.$set(Firebase.ServerValue.TIMESTAMP);
    }

    $rootScope.$on('$firebaseSimpleLogin:logout', function() {
      console.log('remove connection pls', con);
      $rootScope.disconnect();
      console.log('set lastonline pls');        
      $rootScope.loggedIn = false;
      $rootScope.displayName = '';
      $rootScope.profilePicture = '';
      $rootScope.profilePictureM = '';
    });
  });

  return {
    fbLogin: function(next) {
      return function() {
        auth.$login('facebook', {
          scope: 'email, publish_actions',
          rememberMe: true
        }).then(function(user) {
          next(user);
        }, function(error) {
          console.log(error);
        });
      }
    },

    logout: function(next) {
      return function() {
        console.log('logging out...?');
        auth.$logout();
        next();
      }
    },

    getUser: function() {
      return auth.$getCurrentUser();
    }
  }
}])

.controller('base', ['$scope', 'sessionService', '$window', function($scope, session, $window) {

  $scope.fbLogin = session.fbLogin(function(user) {
    console.log('logged in as', user.uid, user.displayName);
  });

  $scope.logout = session.logout(function() {
    console.log('user logged out.');
  });

  //don't log out on leave, but do disconnect
  angular.element($window).bind('unload', function() {
    if($scope.disconnect) $scope.disconnect();
  });

}])

.controller('activityFeed', ['$firebase', '$scope', 'sessionService', '$window', '$http', 'firebaseService', function($firebase, $scope, session, $window, $http, db) {
  
  $scope.activity = db.get$firebase().$child('/activity');
  $scope.feed = [];
  
  $scope.activity.$on('child_added', function(postSnap) {
    console.log(postSnap);
    if(postSnap.snapshot.value === null) return;
    if($.inArray(postSnap.snapshot.value, $scope.feed) > -1) return;
    $scope.feed.unshift(postSnap.snapshot.value);
  });
  
  $scope.publishActivity = function() {
    var msg = $scope.activityForm.message;
    if (!msg) { $scope.flashMessage = 'Nothing to post!'; return; }
    session.getUser().then(function(user) {
      if (user === null) $scope.flashMessage = 'Error: Not logged in. Please refresh.';
      else {
        $scope.activity.$add({user: user.id, textContent: msg, timestamp: db.timestamp(), profilePictureM: $scope.profilePictureM, displayName: $scope.displayName});
      }
    });
  }
  
}]);