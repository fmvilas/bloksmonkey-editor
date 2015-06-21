var Mn = require('backbone.marionette');
var _ = require('underscore');
var $ = require('jquery');
var BloksMonkey = require('../../../core/core');
var template = require('../templates/menu-item.jade');
var MenuItemView;

MenuItemView = {
  template: template,
  tagName: 'li',
  events: {
    'click .js-item': 'onClickItem'
  },
  ui: {
    item: '.js-item'
  }
};

MenuItemView.initialize = function (options) {
  this.options = options;
  this.coordinator = options.coordinator;
  this.model = options.model;
};

MenuItemView.onRender = function () {
  var sidebar_apps = this.options.sidebar_view.ui.sidebar_apps,
      id = 'sidebar-apps-' + this.model.get('name') + '-container',
      $container;

  if( this.model.get('has_sidebar_panel') && !this.options.sidebar_view.$('#'+id).length ) {
    $container = $('<div>');
    $container.attr('id', id);
    sidebar_apps.append($container);
  }
};

MenuItemView.onClickItem = function (ev) {
  this.coordinator.trigger('item.click', {
    app: this.model,
    event: ev
  });

  $('.js-item', this.$el.parents('.js-menu')).removeClass('active');
  this.ui.item.addClass('active');
};

MenuItemView.serializeData = function () {
  return {
    item: this.model
  };
};

module.exports = Mn.ItemView.extend(MenuItemView);
