var Mn = require('backbone.marionette');
var ProjectListView;

ProjectListView = {
  childView: require('./project-item'),
  viewComparator: 'updated_at'
};

ProjectListView.initialize = function (options) {
  this.options = options;
  this.coordinator = options.coordinator;
  this.collection = options.collection;
  this.childViewOptions = { coordinator: options.coordinator };
};

ProjectListView.onBeforeRender = function () {
  this.options.el.html('');
};

module.exports = Mn.CollectionView.extend(ProjectListView);
