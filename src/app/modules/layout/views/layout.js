var Mn = require('backbone.marionette');
var template = require('../templates/layout.jade');
var Sidebar = require('../../sidebar/sidebar.js');
var Welcome = require('../../welcome/welcome.js');
var LayoutView;

require('../styles/layout.less');

LayoutView = {
  el: 'body',
  template: template,
  ui: {
    sidebar: '.js-layout-sidebar',
    content: '#page-wrapper'
  }
};

LayoutView.onRender = function () {
  Sidebar.load({ el: this.ui.sidebar });
  Welcome.load({ el: this.ui.content });
  //var MainMenu = require('../modules/main-menu/main');
  //new MainMenu().renderTo( layout.northPanel );
};

module.exports = Mn.LayoutView.extend(LayoutView);
