var BloksMonkey = require('../../core/core');
var SidebarAppCollection = require('../../collections/sidebar-app');
var Sidebar = {};

BloksMonkey.data.set('sidebar_apps', new SidebarAppCollection());

Sidebar.Apps = BloksMonkey.data.get('sidebar_apps');

module.exports = Sidebar;
