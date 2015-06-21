var BloksMonkey = require('../../../core/core');
var Mn = require('backbone.marionette');
var _ = require('underscore');
var moment = require('moment');
var template = require('../templates/project-item.jade');
var ProjectItemViewStatic = {};
var ProjectItemView;

ProjectItemView = {
  template: template,
  className: 'feed-element',

  events: {
    'click .js-project': 'onProjectClick'
  }
};

ProjectItemView.initialize = function (options) {
  this.options = options;
  this.coordinator = options.coordinator;
};

ProjectItemView.onProjectClick = function (ev) {
  var pid = this.$(ev.currentTarget).data('project-id');
  BloksMonkey.api.project.open({ project_id: pid });
  BloksMonkey.events.trigger('action.sidebar.open');
};

ProjectItemView.serializeData = function () {
  return _.extend(ProjectItemViewStatic, {
    project: this.model,
    project_date: moment(this.model.get('updated_at'), 'ddd MMM DD YYYY HH:mm:ss').format('ddd MMM DD YYYY HH:mm:ss')
  });
};

module.exports = Mn.ItemView.extend(ProjectItemView);
