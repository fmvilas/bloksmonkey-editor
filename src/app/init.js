var core = require('./core/core.js');
var request = require('superagent');

// CHECK IF LOGGED IN
//   - IF NOT, REDIRECT TO LOGIN AND START AGAIN
// CHECK IF OAUTH_TOKEN IS IN LOCALSTORAGE
//   - IF NOT START OAUTH DANCE (SEE BELOW)
// USE OAUTH_TOKEN TO RETRIEVE USER/BOOTSTRAP INFORMATION
//   - IF UNAUTHORIZED (TOKEN EXPIRED) START OAUTH DANCE (SEE BELOW)

var jqXHR = $.ajax({
  url: core.urlFor('api.v1.oauth2.authorize'),
  data: {
    response_type: 'code',
    client_id: '54de2af99fbafddbf40e822b',
    redirect_uri: 'http://localhost:9000/app',
    scope: 'user project project_files'
  },
  crossDomain: true,
  accepts: 'application/json',
  success: function(data) {
    console.dir(data);
  },
  error: function() {
    console.log('Error');
    console.dir(arguments);
  },
  statusCode: {
    401: function (data) {
      if( data && data.responseJSON && data.responseJSON.code === 'not_logged_in' ) {
        core.redirectTo('login');
      }
    }
  },
  complete: function () {
    console.dir(jqXHR);
  }

});

// REQUEST ACCESS TOKEN
// IT WILL REDIRECT IF NOT LOGGED IN - SO WE SHOULD PERFORM A REDIRECTION HERE
//   * AFTER LOGIN IT WILL START AGAIN, BUT LOGGED IN
// IT WILL RESPOND BACK WITH THE TOKEN
// SAVE TOKEN ON LOCALSTORAGE FOR USING ON EVERY REQUEST

// Constructs the Didgeridoo User Interface.
/*require(['modules/main-menu/main'], function(MainMenu) {
    new MainMenu().renderTo( layout.northPanel );
});

didgeridoo.api.project.open('54cfcc0244b6fd7034198f20');

layout.getSideBar().addPanel('modules/dom-inspector/main');
layout.getSideBar().addPanel('modules/project-explorer/main');
didgeridoo.api.event.subscribe('didgeridoo.api.project.open', function() {
    didgeridoo.api.action.do('FileOpen', '/index.html');
});*/

// Show confirmation before exiting
/*window.onbeforeunload = function() {
    return "Leaving Didgeridoo this way may cause an information loss.";
};*/
