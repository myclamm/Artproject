angular.module('dangerousWrenchApp')
  .factory('userServices', function ($http,$window) {
    //fb.AsyncInit gets called by the SDK library automagically when we insantiate it
    $window.fbAsyncInit = function() {
      FB.init({
        appId      : '817757534922398',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });
    }

    var userServices = {
      //Leftover functionality from James' project
      generateUserLikes: function(username) {
        var username = JSON.stringify({username: username});
        return $http({
          method: 'POST',
          url: '/generateUserLikes', 
          data: username 
        })
      },
      //Leftover functionality from James' project
      generateUserRecommendations: function(username) { 
        var username = JSON.stringify({username: username});
        return $http({
          method: 'POST',
          url: '/generateRecommendations', 
          data: username 
        }) 
      },

      /////////////////////////////////////
      //Facebook Authentication
      /////////////////////////////////////
      statusChangeCallback: function(response){
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the app
        // know the current login status of the person.
        if (response.status === 'connected'){
          console.log('your userID is: '+response.authResponse.userID);
          userServices.testAPI();
          ////////////////////////////////////////////////////////////
          //This is what gets called after the user logs in. This is subject to change.
          var userID = JSON.stringify({username: response.authResponse.userID});
          $http({
            method: 'POST',
            url: '/signup',
            data: userID
          })
          console.log('your userID is ' + response.authResponse.userID)
          ////////////////////////////////////////////////////////////
        } else if(response.status === 'not_authorized'){
          // The person is logged into Facebook, but not your app.
          document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
        } else {
          // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
          document.getElementById('status').innerHTML = 'Please log '+'into Facebook.';
          FB.login();
        }
      },

      //This function is called when someone finishes with the Login Button.
      checkLoginState: function(){
        console.log('inside checklogin State')
        FB.getLoginStatus(function(response){
          console.log('inside FB.getLoginSTatus')
          userServices.statusChangeCallback(response);
        });
      },

      //Controller will have to call this to initialize Facebook's Javacsript SDK
      fbAsyncInit: function(){
        FB.init({
          appId      : '817757534922398',
          cookie     : true,  // enable cookies to allow the server to access 
                              // the session
          xfbml      : true,  // parse social plugins on this page
          version    : 'v2.1' // use version 2.1
        });
      },

      //very simple test of the Graph API after login is successful. See the statusChangeCallback()
      //for when this call is made.
      testAPI: function(){
        console.log('Welcome! Fetching your information...');
        FB.api('/me',function(response){
          console.log('Successful login for: ' + response.name);
          document.getElementById('status').innerHTML = 'Thanks for logging in, '+response.name + '!';
        });
      }

    }

    return userServices;
  });
