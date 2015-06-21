var Mn = require('backbone.marionette');
var _ = require('underscore');
var BloksMonkey = require('../../../core/core');
var MenuItemView = require('./menu-item');
var MainMenuView;

MainMenuView = {
  id: 'MainMenuView',
  childView: MenuItemView,

  viewComparator: function (a, b) {
    if( a.get('order') > b.get('order') ) {
      return 1;
    } else if( a.get('order') < b.get('order') ) {
      return -1;
    } else {
      return 0;
    }
  }
};

MainMenuView.initialize = function (options) {
  this.options = options;
  this.coordinator = options.coordinator;
  this.childViewOptions = {
    coordinator: this.coordinator,
    sidebar_view: options.sidebar_view
  };
  this.collection = BloksMonkey.api.app.collection;
};

module.exports = Mn.CollectionView.extend(MainMenuView);
