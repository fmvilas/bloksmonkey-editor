var Mn = require('backbone.marionette');
var template = require('../templates/sidebar.jade');
var SidebarView;

require('../styles/sidebar.less');

SidebarView = {
  template: template
};

SidebarView.onRender = function () {
  console.log('Sidebar rendered');
  //var MainMenu = require('../modules/main-menu/main');
  //new MainMenu().renderTo( layout.northPanel );
};

module.exports = Mn.LayoutView.extend(SidebarView);
