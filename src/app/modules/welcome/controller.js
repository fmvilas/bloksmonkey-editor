var BloksMonkey = require('../../core/core');
var Mn = require('backbone.marionette');
var $ = require('jquery');
var WelcomeView = require('./views/welcome.js');
var WelcomeController = {};
var WelcomeControllerStatic = {};

WelcomeController = {
  initialize: function (options) {
    WelcomeControllerStatic.el = options.el;
  },
  welcome: function () {
    BloksMonkey.api.user.get(function (err, user) {
      var view = new WelcomeView({
            el: WelcomeControllerStatic.el,
            user: user
          });

      view.render();
    });
  }
};

module.exports = Mn.Controller.extend(WelcomeController);
