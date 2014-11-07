import Ember from 'ember';
// import PagedArray from 'ember-cli-pagination/local/paged-array';
// import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';

var toArray = function(a) {
  var res = [];
  if (a.forEach) {
    a.forEach(function(obj) {
      res.push(obj);
    });
  }
  else {
    res = a;
  }
  return res;
};

var pushPromiseObjects = function(base,promise) {
  promise.then(function(r) {
    base.pushObjects(toArray(r));
  });
  return promise;
};

var InfiniteBase = Ember.ArrayProxy.extend({
  page: 1,

  arrangedContent: function() {
    return this.get('content');
  }.property('content.@each'),

  init: function() {
    this.set('content',[]);
    this.addRecordsForPage(1);
  },

  loadNextPage: function() {
    this.incrementProperty('page');
    var page = this.get('page');
    return this.addRecordsForPage(page);
  },

  addRecordsForPage: function(page) {
    var arr = this.getRecordsForPage(page);
    return pushPromiseObjects(this.get('content'),arr);
  },

  getRecordsForPage: function(/* page */) {
    throw "Not Implemented";
  }
});

export default InfiniteBase.extend({
  getRecordsForPage: function(page) {
    var c = this.get('all');
    c.set('page',page);
    return c;
  },

  then: function(f,f2) {
    this.get('all').then(f,f2);
  }
});