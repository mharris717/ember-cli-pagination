import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

export default Ember.Object.extend({
  objsForPage: function(page) {
    var range = this.range(page);
    return this.get('all').slice(range.start,range.end+1);
  },

  totalPages: function() {
    var allLength = parseFloat(this.get('all.length'));
    var perPage = parseFloat(this.get('perPage'));

    var res = (allLength + perPage-0.01) / perPage;
    res = parseInt(res);

    if (allLength === 0) {
      res = 0;
    }
    
    Util.log("DivideIntoPages#totalPages, allLength " + allLength + ", perPage " + perPage + ", res " + res);
    return res;
  },

  range: function(page) {
    var perPage = this.get('perPage');
    var s = (page - 1) * perPage;
    var e = s + perPage - 1;

    return {start: s, end: e};
  }
});