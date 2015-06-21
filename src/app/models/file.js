var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  getEditRoute: function () {
    if( this.isDashboard() ) {
      return '#!/editor/dashboard';
    }

    if( this.isNew() ) {
      return '#!/editor/file/new/' + this.get('id') + '/edit';
    }
    return '#!/editor/file/' + this.get('id') + '/edit';
  },

  isNew: function () {
    return !!this.get('isNew');
  },

  isDashboard: function () {
    return this.get('id') === 'dashboard';
  }
});
