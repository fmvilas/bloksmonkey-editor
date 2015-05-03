var core = require('./core/core.js');
var request = require('superagent');
var url = require('url');
var ls = require('local-storage');
var config = window.config;

// CHECK IF LOGGED IN
//   - IF NOT, REDIRECT TO LOGIN AND START AGAIN
// CHECK IF OAUTH_TOKEN IS IN LOCALSTORAGE
//   - IF NOT START OAUTH DANCE (SEE BELOW)
// USE OAUTH_TOKEN TO RETRIEVE USER/BOOTSTRAP INFORMATION
//   - IF UNAUTHORIZED (TOKEN EXPIRED) START OAUTH DANCE (SEE BELOW)

function handleError (err, res) {
  var error = res.unauthorized && res.body ? res.body.code : null;

  switch(error) {
    case 'not_logged_in':
      core.redirectTo('login');
      break;
    case 'oauth2_token_expired':
      ls.remove('oauth2_token');
      window.location.reload();
      break;
  }
}

function requestToken () {
  return request
    .get(core.urlFor('api.v1.oauth2.authorize'))
    .query({ response_type: 'code' })
    .query({ client_id: config.oauth.client_id })
    .query({ redirect_uri: config.oauth.redirect_uri })
    .query({ scope: 'user project project_files' })
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if( err ) { return handleError(err, res); }

      var responseURL = res.xhr.responseURL;
      var res_url = url.parse(res.xhr.responseURL, true, true);
      var token = res_url.query ? res_url.query.access_token : null;

      if( res.ok && responseURL.match(new RegExp('^'+core.urlFor('root', true))) && token ) {
        ls.set('oauth2_token', token);
      }
    });
}

function start (err, res) {
  window.bootstrap_data = res.body;
}

function requestBootstrapData () {
  return request
    .get(core.urlFor('api.internal.bootstrap'))
    .query({ access_token: ls.get('oauth2_token') })
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if( err ) { return handleError(err, res); }

      start(err, res);
    });
}

if( !ls.get('oauth2_token') ) {
  requestToken().on('end', function () {
    requestBootstrapData();
  });
} else {
  requestBootstrapData();
}

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
