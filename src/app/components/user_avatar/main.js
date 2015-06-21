var BloksMonkey = require('../../core/core');
var Backbone = require('backbone');
var Mn = require('backbone.marionette');
var _ = require('underscore');
var template = require('./templates/avatar.jade');
var UserAvatar;

require('./styles/styles.less');

UserAvatar = {
  template: template,
  ui: {
    photo: '.js-avatar-photo',
    initials: '.js-avatar-initials'
  },
  className: 'bm-component-user-avatar'
};

UserAvatar.initialize = function (options) {
  this.options = options;
  this.coordinator = options.coordinator || new Backbone.Model({});

  this.coordinator.set('user', options.user);
  BloksMonkey.events.on('api.user.update', this.updateAvatar, this);
};

UserAvatar.onRender = function () {
  this.$el.addClass('bm-component-user-avatar');
  this.updateAvatar();
};

UserAvatar.onUserUpdate = function (data) {
  this.coordinator.set('user', data.user);
  this.updateAvatar();
};

UserAvatar.updateAvatar = function () {
  var user = this.coordinator.get('user'),
      avatar_url = user.get('avatar_url'),
      initials = user.getInitials();

  if( avatar_url !== '' ) {
    this.ui.photo.css('background-image', 'url(' + avatar_url + ')');
    this.ui.initials.hide();
    this.ui.photo.show();
  } else {
    this.ui.initials.html(initials);
    this.ui.photo.hide();
    this.ui.initials.show();
  }
};

module.exports = Mn.LayoutView.extend(UserAvatar);
