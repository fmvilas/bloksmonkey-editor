var Backbone = require('backbone');
var UserModel = require('../models/user');

module.exports = Backbone.Collection.extend({
  model: UserModel
});
