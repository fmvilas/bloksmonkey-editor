var Backbone = require('backbone');
var BloksMonkey = require('./core/core.js');
var request = require('superagent');
var url = require('url');
var ls = require('local-storage');
var config = window.config;

function handleError (err, res) {
  var error = res.body ? res.body.code : null;

  switch(error) {
    case 'not_logged_in':
      BloksMonkey.redirectTo('login');
      break;
    case 'oauth2_token_expired':
      ls.remove('oauth2_token');
      window.location.reload();
      break;
  }
}

function requestToken () {
  return request
    .get(BloksMonkey.urlFor('api.v1.oauth2.authorize'))
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

      if( res.ok && responseURL.match(new RegExp('^'+BloksMonkey.urlFor('root', true))) && token ) {
        ls.set('oauth2_token', token);
      }
    });
}

function requestBootstrapData () {
  return request
    .get(BloksMonkey.urlFor('api.internal.bootstrap'))
    .query({ access_token: ls.get('oauth2_token') })
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if( err ) { return handleError(err, res); }

      BloksMonkey.start({ data: res.body });
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
