var router = function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/partials/activityFeed',
    controller: 'activityFeed'
  });
  $routeProvider.when('/marketplace', {
    templateUrl: '/partials/marketplace',
    controller: 'marketplace'
  });
  $routeProvider.when('/mygear', {
    templateUrl: '/partials/myGear',
    controller: 'myGear'
  });
}

angular.module('outrovert', ['firebase', 'ngRoute', 'ui.bootstrap'], router)

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

    var userConnections = userData.$child('connections');
    var lastOnline = userData.$child('lastOnline');

    var con;

    var UA = navigator.userAgent;
    var time = db.timestamp();

    //console.log(con);

    if(!con) userConnections.$add({agent: UA, timestamp: time}).then(function(ref) {
      con = ref.name();
      
      console.log(user);
    
      if(user.displayName)
        userData.$update({displayName: user.displayName});
      if(user.thirdPartyUserData.location)
        userData.$update({location: user.thirdPartyUserData.location.name});
      if(user.thirdPartyUserData.hometown)
        userData.$update({hometown: user.thirdPartyUserData.hometown.name});
      if(user.thirdPartyUserData.email)
        userData.$update({email: user.thirdPartyUserData.email});
      
      $rootScope.loggedIn = true;
      $rootScope.displayName = user.displayName;
      $rootScope.profilePicture = 'http://graph.facebook.com/'+user.id+'/picture?type=small';
      $rootScope.profilePictureM = 'http://graph.facebook.com/'+user.id+'/picture';
      $rootScope.location = user.thirdPartyUserData.location ? user.thirdPartyUserData.location.name : null;
      $rootScope.hometown = user.thirdPartyUserData.hometown ? user.thirdPartyUserData.hometown.name : null;
    });

    $rootScope.disconnect = function() {
      if(con) userConnections.$remove(con);
      lastOnline.$set(Firebase.ServerValue.TIMESTAMP);
    }

    $rootScope.$on('$firebaseSimpleLogin:logout', function() {
      $rootScope.disconnect();
      $rootScope.loggedIn = false;
      $rootScope.displayName = '';
      $rootScope.profilePicture = '';
      $rootScope.profilePictureM = '';
      $rootScope.location = '';
      $rootScope.hometown = '';
    });
  });

  return {
    fbLogin: function(next) {
      return function() {
        auth.$login('facebook', {
          scope: 'email, publish_actions, user_location',
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

.controller('base', ['$scope', 'sessionService', '$window', '$position', function($scope, session, $window) {

  $scope.fbLogin = session.fbLogin(function(user) {
    console.log('logged in as', user.uid, user.displayName);
  });

  $scope.logout = session.logout(function() {
    console.log('user logged out.');
  });

  //don't log out on leave, but do disconnect
  //FIXME: doesn't effectively close connection in all cases
  angular.element($window).bind('unload', function() {
    if($scope.disconnect) $scope.disconnect();
  });
  
  session.getUser().then(function(user) {
    $scope.uploadFile = function(el) {
      $scope.imgToUpload = el.files[0];
      $scope.s3upload = new $window.S3Upload({
        //NOTE: encodeURIComponent is key here: if the object_name is all
        //  escaped, that causes errors
        //  only the imgToUpload.name MUST be escaped
        s3_object_name: user.uid + '_' + $scope.imgToUpload.name,
        s3_sign_put_url: 'aws0signature',
        file_dom_selector: null
      });
      $scope.fileElement = el;
    };
  });
}])

.controller('activityFeed', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', function($scope, session, $window, $http, db) {
  
  $scope.activityForm = {};
  $scope.activityForm.message = '';
  
  $scope.activity = db.get$firebase().$child('/activity');
  $scope.feed = [];
  
  $scope.activity.$on('child_added', function(postSnap) {
    console.log(postSnap);
    if(postSnap.snapshot.value === null) return;
    $scope.feed.unshift([postSnap.snapshot.name, postSnap.snapshot.value]);
  });
  
  $scope.publishActivity = function() {
    var msg = $scope.activityForm.message;
    if (!msg) { $scope.flashMessage = 'Nothing to post!'; return; }
    session.getUser().then(function(user) {
      if (user === null) $scope.flashMessage = 'Error: Not logged in. Please refresh.';
      else {
        var post = {
            user: user.uid, 
            textContent: msg, 
            timestamp: db.timestamp(), 
            profilePictureM: $scope.profilePictureM, 
            displayName: $scope.displayName
        };
        if($scope.s3upload) {
          $scope.s3upload.onFinishS3Put = function(public_url) {
            post.photo = public_url;
            $scope.activity.$add(post);
            $scope.fileElement.value = '';
            $scope.activityForm = {};
          };
          $scope.s3upload.uploadFile($scope.imgToUpload);
        } else {
          $scope.activity.$add(post);
          $scope.activityForm = {};
        }
      }
    });
  }
  
  $scope.deletePost = function(postid) {
    console.log(postid);
    $scope.activity.$remove(postid).then(function(res) {
      console.log(res, 'removed');
      $scope.feed.splice($scope.feed.indexOf($scope.feed.filter(function(el) {  return el[0] === postid; })[0]), 1);
    });
  }
}])

.controller('marketplace', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', '$modal', function($scope, session, $window, $http, db, $modal) {
  //item.image item.poster.profilePicture item.poster.uid item.price item.description.name item.description.quality item.description.tags item.description.categories item.action item.location
  
  $scope.marketdb = db.get$firebase().$child('/marketplace');
  
  $scope.marketplace = [];
  $scope.filterForm  = {};
  $scope.itemForm = {};
  
  $scope.marketdb.$on('child_added', function(itemSnap) {
    console.log(itemSnap);
    if(itemSnap.snapshot.value === null) return;
    $scope.marketplace.unshift(itemSnap.snapshot.value);
  });
  
  $scope.toggleBtns = function(which) {
    if ( which === 'buy' ) {
      $scope.showBuy = true;
      $scope.showRent = !$scope.showRent;
    }
    else {
      $scope.showRent = true; 
      $scope.showBuy  = !$scope.showBuy;
    }
    if(! ($scope.showBuy || $scope.showRent) ) $scope.showBuy = $scope.showRent = true;
  };
  
  $scope.showHide = function(type) {
    return (type == "Buy" && $scope.showBuy) || (type == "Rent" && $scope.showRent);
  };
  
  var modalController = function($scope, $modalInstance) {
    $scope.ok = function() {
      $modalInstance.close();
    };
    
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };
  
  $scope.openTransaction = function(r) {
    var modal = $modal.open({
      templateUrl: 'modal.html',
      controller:  modalController
    });
    
    modal.result.then(function() {
      //confirmation == whatever is passed in. So nothing?
      //send an email with node-mailer
      session.getUser().then(function(user) {
        $http.post('/transaction', {user: user, r: r})
        .success(function(res) {
          console.log("the transaction was committed.");
          //should do something to prevent double transactions
        })
        .error(function(error) {
          console.log(error);
        });
      });
      
    }, function(cancellation) {
      //nothing needs done here...
      console.log("cancel!");
    });
  };
  
}])

.controller('myGear', ['$scope', 'sessionService', 'firebaseService', '$window', '$location', function($scope, session, db, $window, $location) {
  session.getUser().then(function(user) {
    
    if(user === null) {
      console.log("not logged in");
      $location.path('/');
      return;
    }
    
    $scope.myGear = [];
    $scope.addGearForm = {};

    var myGearDB = db.get$firebase().$child('/users/'+user.uid + '/gear');
    var marketDB = db.get$firebase().$child('/marketplace');

    myGearDB.$on('child_added', function(gearSnap) {
      console.log(gearSnap);
      if(gearSnap.snapshot.value === null) return;
      $scope.myGear.unshift([gearSnap.snapshot.name, gearSnap.snapshot.value]);
    });

    $scope.addGear = function() {
      $scope.s3upload.onFinishS3Put = function(public_url) {
        var item = {
          name: $scope.addGearForm.name,
          description: $scope.addGearForm.description,
          condition: $scope.addGearForm.condition,
          price: $scope.addGearForm.price,
          rentOrBuy: $scope.addGearForm.rentalOrSale === 'Sell' ? 'Buy' : 'Rent',
          image: public_url
        }
        var poster = {
          uid: user.uid,
          profilePicture: 'http://graph.facebook.com/' + user.id + '/picture?type=small'
        }
        var idPromise = myGearDB.$add(item);
        idPromise.then(function(gear) {
          marketDB.$child(gear.name()).$set({item: item, poster: poster});
        });
        
        $scope.addGearForm = {};
        $scope.fileElement.value = '';
      };
      $scope.s3upload.uploadFile($scope.imgToUpload);
    }
  
    $scope.deleteGear = function (key) {
      myGearDB.$remove(key);
      marketDB.$remove(key);
      $scope.myGear.splice($scope.myGear.indexOf($scope.myGear.filter(function(el) { return el[0] === key; })[0]), 1);
    }
  });
  
}]);

