import Ember from 'ember';

export default Ember.Object.extend({
  objsForPage: function(page) {
    var range = this.range(page);
    return this.get('all').slice(range.start,range.end+1);
  },

  totalPages: function() {
    var allLength = parseInt(this.get('all.length'));
    var perPage = parseInt(this.get('perPage'));
    return Math.ceil(allLength/perPage);
  },

  range: function(page) {
    var perPage = parseInt(this.get('perPage'));
    var s = (parseInt(page) - 1) * perPage;
    var e = s + perPage - 1;

    return {start: s, end: e};
  }
});