var SidbarView = require('./views/sidebar.js');
var Sidebar = {};

Sidebar.load = function (options) {
  var view = new SidbarView(options);
  view.render();
};

module.exports = Sidebar;
