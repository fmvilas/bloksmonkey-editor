var BloksMonkey = require('../core/core');
var Backbone = require('backbone');
var AppModel = require('../models/app');

module.exports = Backbone.Collection.extend({
  model: AppModel,

  initialize: function () {
    this.url = '/api/v1/users/' + BloksMonkey.data.get('bootstrap').user_id + '/apps';
  }
});
