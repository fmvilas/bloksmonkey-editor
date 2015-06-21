var Backbone = require('backbone');
var FileModel = require('../models/file');

module.exports = Backbone.Collection.extend({
  model: FileModel
});
