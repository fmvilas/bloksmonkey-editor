var BloksMonkey = require('../../../core/core');
var $ = require('jquery');
var Mn = require('backbone.marionette');
var template = require('../templates/sidebar.jade');
var SidebarView;

require('../styles/sidebar.less');

SidebarView = {
  template: template,
  ui: {
    menu: '.js-menu',
    user_menu: '.js-user-menu',
    sidebar_apps: '.js-sidebar-apps'
  }
};

SidebarView.initialize = function (options) {
  this.options = options;
  this.coordinator = options.coordinator;
  this.coordinator.set('apps', BloksMonkey.api.app.collection.toJSON());
  BloksMonkey.events.on('action.sidebar.toggle', this.onToggle);
  BloksMonkey.events.on('action.sidebar.open', this.onOpen);
  BloksMonkey.events.on('action.sidebar.close', this.onClose);
};

SidebarView.onToggle = function () {
  var is_open = $('body').hasClass('sidebar-apps-open');
  $('body').toggleClass('sidebar-apps-open');
  BloksMonkey.events.trigger('sidebar.' + (is_open ? 'closed' : 'opened'));
};

SidebarView.onOpen = function () {
  $('body').addClass('sidebar-apps-open');
  BloksMonkey.events.trigger('sidebar.opened');
};

SidebarView.onClose = function () {
  $('body').removeClass('sidebar-apps-open');
  BloksMonkey.events.trigger('sidebar.closed');
};

SidebarView.onRender = function () {
  var MainMenu = require('./main-menu'),
      UserMenu = require('../../user/user'),
      mainMenu,
      self = this;

  BloksMonkey.events.on('action.sidebar.app.add', function (data) {
    mainMenu = new MainMenu({
      el: self.ui.menu,
      coordinator: self.coordinator,
      sidebar_view: self
    });

    mainMenu.render();
  });

  // TODO: remove dependency by extracting this to a widget
  UserMenu.load({
    el: this.ui.user_menu
  });
};

SidebarView.serializeData = function () {
  return {
    urlFor: BloksMonkey.urlFor,
    apps: this.coordinator.get('apps')
  };
};

module.exports = Mn.LayoutView.extend(SidebarView);
