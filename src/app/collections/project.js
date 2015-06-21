var Backbone = require('backbone');
var ProjectModel = require('../models/project');

module.exports = Backbone.Collection.extend({
  model: ProjectModel
});
