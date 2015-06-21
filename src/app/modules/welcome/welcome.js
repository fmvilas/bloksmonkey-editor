var BloksMonkey = require('../../core/core');
var WelcomeController = require('./controller.js');
var Bootstrap = require('bootstrap');
var Welcome = {};

Welcome.load = function (options) {
  var controller = new WelcomeController(options);

  BloksMonkey.router.route('', 'welcome', controller.welcome);

  BloksMonkey.router.on('route', function (name, params) {
    if( name === 'welcome' ) {
      BloksMonkey.api.layout.switchTo('page');
    }
  });
};

module.exports = Welcome;
