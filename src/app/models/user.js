var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  getInitials: function () {
    var words = this.get('name').split(' '),
        result = words[0].substr(0,1).toUpperCase();

    if( words.length > 1 ) {
      result += words[1].substr(0,1).toLowerCase();
    }

    return result;
  }
});
