var LayoutView = require('./views/layout.js');
var Bootstrap = require('bootstrap');
var Layout = {};

Layout.load = function () {
  var view = new LayoutView();
  view.render();
};

module.exports = Layout;
