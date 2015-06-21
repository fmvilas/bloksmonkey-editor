var SidebarView = require('./views/sidebar.js');
var Sidebar = {};

Sidebar.load = function (options) {
  var coordinator = new Backbone.Model(),
      view = new SidebarView(_.extend(options, {
        coordinator: coordinator
      }));

  coordinator.on('item.click', function(item) {
    BloksMonkey.events.trigger('sidebar.app.' + item.app.get('name') + '.click', item);
  });

  view.render();
};

module.exports = Sidebar;
