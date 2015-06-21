var BloksMonkey = require('../../../core/core');
var Mn = require('backbone.marionette');
var template = require('../templates/user.jade');
var UserView;

require('../styles/user.less');

UserView = {
  template: template,
  ui: {
    avatar: '.js-avatar',
    photo: '.js-avatar-photo',
    initials: '.js-avatar-initials'
  },
  events: {
    'click .js-avatar': 'onAvatarClick'
  }
};

UserView.initialize = function (options) {
  this.options = options;
  this.coordinator = options.coordinator;

  BloksMonkey.events.on('api.user.get', this.onUserGet, this);
};

UserView.onUserGet = function (user) {
  var avatar_url = user.get('avatar_url'),
      initials = this.generateInitials(user.get('name'));

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

UserView.onAvatarClick = function (ev) {
  this.ui.avatar.dropdown();
};

UserView.generateInitials = function (name) {
  var words = name.split(' '),
      result = words[0].substr(0,1).toUpperCase();

  if( words.length > 1 ) {
    result += words[1].substr(0,1).toLowerCase();
  }

  return result;
};

UserView.serializeData = function () {
  return {

  };
};

module.exports = Mn.LayoutView.extend(UserView);
