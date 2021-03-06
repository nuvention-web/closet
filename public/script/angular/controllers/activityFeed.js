app.controller('activityFeed', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', function($scope, session, $window, $http, db) {
  
  $scope.activityForm = {};
  $scope.activityForm.message = '';

  $scope.commentForm = {};
  
  $scope.activity = db.getActivityRef();
  $scope.feed = [];
  
  $scope.activity.$on('child_added', function(postSnap) {
    console.log('child added');
    console.log(postSnap);
    if(postSnap.snapshot.value === null) return; //check should be unnecessary with input validation
    $scope.feed.unshift([postSnap.snapshot.name, postSnap.snapshot.value]);
  });

  $scope.activity.$on('child_changed', function(postSnap) {
    console.log('child changed');
    console.log(postSnap);
    if(postSnap.snapshot.value === null) return; //check should be unnecessary with input validation
    $scope.$apply(function() {
      $scope.feed = $scope.feed.map(function(el) {
        if (el[0] == postSnap.snapshot.name)
          return [postSnap.snapshot.name, postSnap.snapshot.value];
        return el;
      });
    });
  });
  
  $scope.activity.$on('child_removed', function(rmSnap) {
    console.log(rmSnap);
    $scope.feed.splice($scope.feed.indexOf($scope.feed.filter(function(el) {  return el[0] === rmSnap.snapshot.name; })[0]), 1);
  });
  
  $scope.uploadFile = function(el) {
    $scope.imgToUpload = el.files[0];
    session.getUser(function(user) {
      $scope.s3upload = new $window.S3Upload({
        s3_object_name: user.uid + '_' + el.files[0].name,
        s3_sign_put_url: 'aws0signature',
        file_dom_selector: null
      });
    });
    $scope.fileElement = el;
  };
  
  $scope.publishActivity = function() {
    var msg = $scope.activityForm.message;
    if (!msg) { $scope.flashMessage = 'Nothing to post!'; return; }
    session.getUser(function(user) {
      if (user === null) $scope.flashMessage = 'Error: Not logged in. Please refresh.';
      else {
        console.log(user);
        var post = {
            user: user.uid, 
            textContent: msg, 
            timestamp: db.timestamp(), 
            profilePictureM: user.profilePictureM,
            displayName: user.displayName
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
    });
  }

  // new stuff starts here

  $scope.publishComment = function(post) {
    var msg = $scope.commentForm[post];
    if (!msg) { $scope.flashMessage = 'Nothing to post!'; return; }
    session.getUser(function(user) {
      if (user === null) $scope.flashMessage = 'Error: Not logged in. Please refresh.';
      else {
        var comment = {
            user: user.uid, 
            textContent: msg, 
            timestamp: db.timestamp(), 
            profilePictureM: user.profilePictureM,
            displayName: user.displayName
        };
        $scope.activity.$child(post).$child('comments').$add(comment).then(function(ref) {
          console.log(ref);
          ref.update({key: ref.name()});
          console.log(ref);
        });
        $scope.commentForm = {};
      }
    });
  }

  $scope.deleteComment = function(commentid, postid) {
    console.log('comment');
    console.log(commentid);
    console.log('post');
    console.log(postid);
    console.log('feed');
    console.log($scope.feed.postid);
    //index - is commentid.key;
    $scope.activity
    .$child(postid)
    .$child('comments')
    .$remove(commentid.key);
  }

  // new stuff ends here

}]);