var Backbone = require('backbone');
var SidebarAppModel = require('../models/sidebar-app');

module.exports = Backbone.Collection.extend({
  model: SidebarAppModel
});
