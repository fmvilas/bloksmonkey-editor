"use strict";

var Backbone = require('backbone');
var Mn = require('backbone.marionette');
var Wreqr = require('backbone.wreqr');
var request = require('superagent');
var ls = require('local-storage');
var _ = require('underscore');
var $ = require('jquery');
var BloksMonkey;
var BloksMonkeyApp;
var app_channel = Wreqr.radio.channel('bm');
var config = window.config;

var BloksMonkeyApp = {
  onStart: function (options) {
    var Layout = require('../modules/layout/layout.js'),
        Router = Backbone.Router.extend({});

    this.data = new Backbone.Model();
    this.data.set('bootstrap', options.data);

    // API
    this.api = {};
    this.api.user = require('../api/user/user');
    this.api.project = require('../api/project/project');
    this.api.file = require('../api/file/file');
    this.api.app = require('../api/app/app');
    this.api.util = require('../api/util/util');
    this.api.layout = require('../api/layout/layout');
    this.api.sidebar = require('../api/sidebar/sidebar');

    // Components
    this.components = {};
    this.components.UserAvatar = require('../components/user_avatar/main');

    // Router
    this.router = new Router();

    Layout.load();

    // Load Apps
    this.api.app.load().then(function () {
      Backbone.history.start({pushState: false, hashChange: true});
      console.log('Application Started!');
    }).fail(function (err) {
      console.error(err);
    });
  },

  /**
   * Redirects to the provided url.
   *
   * @param {string} where URL to which you want to redirect to.
   */
  redirectTo: function (where) {
    window.location.replace(this.urlFor(where) || where);
  },

  /**
   * Gets the corresponding url for a known resource.
   *
   * @param {string} resource The name of the resource.
   * @param {string} [absolute] Whether url should be absolute or not.
   * @returns {string} The url for the resource.
   */
  urlFor: function (resource, absolute) {
    var url;

    switch(resource) {
      case 'root':
        url = '/app';
        break;
      case 'login':
        url = '/login';
        break;
      case 'api.internal.bootstrap':
        url = '/api/internal/bootstrap';
        break;
      case 'api.v1.apps':
        url = '/api/v1/users/' + this.data.get('bootstrap').user_id + '/apps';
        break;
      case 'api.v1.oauth2.authorize':
        url = '/api/v1/oauth2/authorize';
        break;
      case 'auth_app':
        url = '/auth_app';
        break;
    }

    return absolute ? config.app.host + url : url;
  },

  events: {
    trigger: function (message, data) {
      console.log('Triggered %s event with data: %o', message, data);
      app_channel.vent.trigger(message, data);
    },

    on: function (message, handler, context) {
      console.log('Listening %s event', message);
      app_channel.vent.on(message, handler, context);
    }
  }
};

BloksMonkeyApp = Mn.Application.extend(BloksMonkeyApp);
BloksMonkey = new BloksMonkeyApp();

window.BloksMonkey = BloksMonkey; // Populating to global variable can be handy
module.exports = BloksMonkey;
