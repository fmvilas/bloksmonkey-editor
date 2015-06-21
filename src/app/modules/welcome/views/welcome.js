var BloksMonkey = require('../../../core/core');
var Mn = require('backbone.marionette');
var _ = require('underscore');
var template = require('../templates/welcome.jade');
var ProjectListView = require('./project-list.js');
var WelcomeViewStatic = {};
var WelcomeView;

require('../styles/styles.less');

WelcomeView = {
  template: template,
  ui: {
    projects: '.js-projects'
  }
};

WelcomeView.initialize = function (options) {
  this.options = options;
  this.coordinator = options.coordinator;

  WelcomeViewStatic.firstName = options.user.get('name').split(' ')[0];
};

WelcomeView.onRender = function () {
  var self = this;

  BloksMonkey.api.project.list()
  .done(function (data) {
    var projectsView = new ProjectListView({
      el: self.ui.projects,
      coordinator: self.coordinator,
      collection: data.projects
    });

    projectsView.render();
  });
};

WelcomeView.serializeData = function () {
  return _.extend(WelcomeViewStatic, {
    user: this.options.user
  });
};

module.exports = Mn.LayoutView.extend(WelcomeView);
