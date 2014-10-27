import Ember from 'ember';

export default Ember.Object.extend({
  numPagesToShowBefore: 5,
  numPagesToShowAfter: 5,
  currentPage: null,
  totalPages: null,

  isValidPage: function(page) {
    page = parseInt(page);
    var totalPages = parseInt(this.get('totalPages'));

    return page > 0 && page <= totalPages;
  },

  pagesToShow: function() {
    var res = [];

    var before = parseInt(this.get('numPagesToShowBefore'));
    var after = parseInt(this.get('numPagesToShowAfter'));
    var currentPage = parseInt(this.get('currentPage'));
    var totalPages = parseInt(this.get('totalPages'));

    // add each prior page
    for(var i=before;i>0;i--) {
      var possiblePage = currentPage-i;
      if (this.isValidPage(possiblePage)) {
        res.push(possiblePage);
      }
    }

    res.push(currentPage);

    // add each following page
    for(i=1;i<=after;i++) {
      var possiblePage2 = currentPage+i;
      if (this.isValidPage(possiblePage2)) {
        res.push(possiblePage2);
      }
    }

    // add first and last page
    if (res.length > 0) {

      // add first page if not already there
      if (res[0] !== 1) {
        res = [1].concat(res);
      }

      // add last page if not already there
      if (res[res.length-1] !== totalPages) {
        res.push(totalPages);
      }
    }

    return res;

  }.property("numPagesToShowBefore","numPagesToShowAfter","currentPage","totalPages")
});