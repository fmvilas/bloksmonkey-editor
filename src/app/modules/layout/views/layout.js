var Mn = require('backbone.marionette');
var template = require('../templates/layout.jade');
var Sidebar = require('../../sidebar/sidebar.js');
var LayoutView;

require('../styles/layout.less');

LayoutView = {
  el: 'body',
  template: template,
  regions: {
    sidebar: '.js-layout-sidebar',
    content: '.js-layout-content'
  }
};

LayoutView.onRender = function () {
  Sidebar.load({ el: this.regions.sidebar });
  //var MainMenu = require('../modules/main-menu/main');
  //new MainMenu().renderTo( layout.northPanel );
};

module.exports = Mn.LayoutView.extend(LayoutView);
