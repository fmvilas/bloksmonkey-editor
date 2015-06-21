var BloksMonkey = require('../../core/core');
var assert = require('assert');
var $ = require('jquery');
var is = require('is_js');
var ls = require('local-storage');
var _ = require('underscore');
var User = {};
var UserStatic = {};

function validateUserId (uid) {
  return !!uid.match(/^[a-z0-9]{24}$/);
}

User.Model = require('../../models/user');

/**
 * Returns user information.
 *
 * @param {String} [user_id] The id of the user you want to retrieve information. Default is current user.
 * @param {Object} [options] Options to pass to the API call.
 * @param {Function} callback Callback function to perform once user information is retrieved.
 */
User.get = function() {
  var args = arguments,
      user_id,
      options,
      callback;

  assert(args.length > 0, 'Parameter callback is required');

  if( args.length === 1 ) {
    assert(is.function(args[0]), 'Parameter callback must be a function.');
    user_id = BloksMonkey.data.get('bootstrap').user_id;
    options = {};
    callback = args[0];
  } else if( args.length === 2 ) {
    assert(is.string(args[0]) || is.json(args[0]), 'First parameter should be user_id or options.');
    assert(is.function(args[1]), 'Parameter callback must be a function.');

    if( is.string(args[0]) ) {
      assert(validateUserId(args[0]), 'Invalid user_id parameter.');
      user_id = args[0];
      options = {};
    } else {
      user_id = BloksMonkey.data.get('bootstrap').user_id;
      options = args[0];
    }

    callback = args[1];
  } else {
    assert(is.string(args[0]), 'Parameter user_id should be a string.');
    assert(validateUserId(args[0]), 'Invalid user_id parameter.');
    assert(is.json(args[1]), 'Parameter options must be an object.');
    assert(is.function(args[2]), 'Parameter callback must be a function.');
    user_id = args[0];
    options = args[1];
    callback = args[2];
  }

  if( user_id === BloksMonkey.data.get('bootstrap').user_id && !options.force && UserStatic.current ) {
    callback.call(this, null, User.getCurrent()); return;
  }

  options.query = options.query || {};
  options.query.access_token = ls.get('oauth2_token');

  $.ajax({
    url: '/api/v1/users/' + user_id,
    type: 'GET',
    data: options.query,
    success: function (user) {
      UserStatic.current = new User.Model(user);
      callback.call(this, null, UserStatic.current);
      BloksMonkey.events.trigger('api.user.get', UserStatic.current);
    },
    error: function (err) {
      err.message = 'Couldn\'t get user: ' + err.message;
      callback.call(this, err, null);
    }
  });
};

/**
 * Returns the current loaded user
 *
 * @returns {User} The current loaded user, or null if user has not been loaded yet.
 */
User.getCurrent = function () {
  return UserStatic.current || null;
};

module.exports = User;
