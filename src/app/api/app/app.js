var BloksMonkey = require('../../core/core');
var assert = require('assert');
var Q = require('q');
var is = require('is_js');
var ls = require('local-storage');
var $ = require('jquery');
var async = require('async');
var AppCollection = require('../../collections/app');
var App = {};

var APP_LIST = 'App.list([options]): ';
var ERROR_LIST_OPTIONS = 'If specified, parameter options must be an object.';

App.collection = new AppCollection();

/**
 * Returns a list of apps.
 *
 * @param {Object} [options] Options to pass to the API call.
 * @returns {Promise}
 */
App.list = function (options) {
  return Q.promise(function (resolve, reject) {
    try {
      assert(is.json(options) || is.undefined(options), APP_LIST + ERROR_LIST_OPTIONS);

      options = options || {};
      options.query = options.query || {};
      options.query.access_token = ls.get('oauth2_token');
    } catch(err) {
      reject({ error: err, options: options });
    }

    App.collection.fetch({
      data: options.query,
      crossDomain: true
    }).then(function () {
      resolve({ apps: App.collection, options: options });
      BloksMonkey.events.trigger('api.app.list', { apps: App.collection, options: options });
    }).fail(function (err) {
      err.message = APP_LIST + 'Couldn\'t retrieve app list: ' + err.message;
      reject({ error: err, options: options });
    });
  });
};

App.load = function () {
  var self = this,
      q,
      base_url;

  return Q.promise(function (resolve, reject) {
    self.list().then(function (data) {
      q = async.queue(function (app, callback) {
        base_url = window.config.apps.url + app.get('name') + '/' + app.get('version') + '/';

        if( app.get('config').css ) {
          BloksMonkey.api.util.css.load(base_url + app.get('config').css);
        }

        $.ajax({
          url: base_url + app.get('config').js,
          dataType: 'script',
          cache: true,
          success: function () {
            console.log(app.get('title') + ' app successfully loaded.');
            callback();
          },
          error: function () {
            console.error('Error while trying to load ' + app.get('title') + '.');
            console.error(arguments);
            callback(true);
          }
        });
      }, 5);

      q.drain = function() {
        BloksMonkey.events.trigger('api.apps.loaded', { apps: App.collection });
        resolve();
      };

      q.push(data.apps.models);
    }).fail(function (err) {
      reject(err);
    });
  });
};

module.exports = App;
