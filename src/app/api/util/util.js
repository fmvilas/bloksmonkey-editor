var Util = {};

Util.css = {};

Util.css.load = function (cssFile) {
  var link = document.createElement('link');

  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', cssFile);

  document.querySelector('head').appendChild(link);
};

Util.css.loadScoped = function (css, element) {
  var style = document.createElement('style');

  style.setAttribute('scoped', 'scoped');
  style.innerHTML = css;

  element.appendChild(style);
};

Util.html = {};

Util.html.import = function (htmlFile) {
  var link = document.createElement('link');

  link.setAttribute('rel', 'import');
  link.setAttribute('href', htmlFile);

  document.querySelector('head').appendChild(link);
};

module.exports = Util;
