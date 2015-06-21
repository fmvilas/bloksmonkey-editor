var BloksMonkey = require('../../core/core');
var $ = require('jquery');
var Layout = {};

Layout.switchTo = function (where) {
  var $selector,
      alreadyHasActiveClass;

  switch(where) {
    case 'page':
      $selector = $('#page-wrapper');
      break;
    case 'editor':
      $selector = $('#editor-wrapper');
      break;
  }

  alreadyHasActiveClass = $selector.hasClass('active');

  $('#wrapper > .js-layout-content').removeClass('active');
  $selector.addClass('active');

  if( !alreadyHasActiveClass ) {
    BloksMonkey.events.trigger('api.layout.switch', { target: where });
  }
};

module.exports = Layout;
