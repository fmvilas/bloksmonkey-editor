var BloksMonkey = require('../../core/core');
var Mn = require('backbone.marionette');
var UserController = {};

UserController = {
  userProfile: function () {
    console.log('User profile...');
  },
  userSettings: function () {
    console.log('User settings...');
  }
};

module.exports = Mn.Controller.extend(UserController);
