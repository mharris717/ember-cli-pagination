import Ember from 'ember';
import SafeGet from '../util/safe-get';

export default Ember.Object.extend(SafeGet, {
  numPagesToShow: 10,
  showFL: false,
  currentPage: null,
  totalPages: null,

  isValidPage: function(page) {
    page = parseInt(page);
    var totalPages = this.getInt('totalPages');

    return page > 0 && page <= totalPages;
  },

  pagesToShow: function() {
    var res = [];

    var numPages = this.getInt('numPagesToShow');
    var currentPage = this.getInt('currentPage');
    var totalPages = this.getInt('totalPages');
    var showFL = this.get('showFL');
    
    var before = parseInt(numPages / 2);    
    if ((currentPage - before) < 1 ) {
      before = currentPage - 1;
    }
    var after = numPages - before - 1;
    if ((totalPages - currentPage) < after) {
      after = totalPages - currentPage;
      before = numPages - after - 1;
    }

    // add one page if no first or last is added
    if (showFL) {
      if ((currentPage - before) < 2 ) {
        after++;
      }
      if ((totalPages - currentPage - 1) < after) {
        before++;
      }      
    }
    
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
    if (showFL) {
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
    }
    
    return res;

  }.property("numPagesToShow","currentPage","totalPages")
});