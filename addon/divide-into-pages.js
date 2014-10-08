import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

export default Ember.Object.extend({
  perPage: 10,
  objsForPage: function(page) {
    var e, perPage, s;
    perPage = this.get('perPage');
    s = (page - 1) * perPage;
    e = s + perPage - 1;
    return this.get('all').slice(s, +e + 1 || 9e9);
  },
  totalPages: function() {
    var allLength, perPage, res;
    allLength = parseFloat(this.get('all.length'));
    perPage = parseFloat(this.get('perPage'));
    res = (allLength + 1.99) / perPage;
    res = parseInt(res);
    if (allLength === 0) {
      res = 0;
    }
    Util.log("DivideIntoPages#totalPages, allLength " + allLength + ", perPage " + perPage + ", res " + res);
    return res;
  },
  range: function(page) {
    var e, perPage, s;
    perPage = this.get('perPage');
    s = (page - 1) * perPage;
    e = s + perPage - 1;
    return {
      start: s,
      end: e
    };
  }
});