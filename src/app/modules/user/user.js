var BloksMonkey = require('../../core/core');
var UserView = require('./views/user.js');
var UserController = require('./controller.js');
var Bootstrap = require('bootstrap');
var User = {};

User.load = function (options) {
  var coordinator = new Backbone.Model(),
      controller = new UserController(),
      view;

  view = new UserView(_.extend(options, {
    coordinator: coordinator
  }));

  BloksMonkey.router.route('!/user/profile', 'user:profile', controller.userProfile);
  BloksMonkey.router.route('!/user/settings', 'user:settings', controller.userSettings);

  BloksMonkey.api.user.get($.noop);
  view.render();
};

module.exports = User;
