import Ember from 'ember';
import Util from 'ember-cli-pagination/util';
import TruncatePages from './truncate-pages';

export default Ember.Object.extend({
  pageItemsAll: function() {
    var currentPage = Number(this.get("currentPage"));
    var totalPages = Number(this.get("totalPages"));
    Util.log("PageNumbers#pageItems, currentPage " + currentPage + ", totalPages " + totalPages);

    var res = [];
    for(var i=1; i<=totalPages; i++) {
      res.push({
        page: i,
        current: currentPage === i
      });
    }
    return res;
  }.property("currentPage", "totalPages"),

  pageItemsTruncated: function() {
    var currentPage = parseInt(this.get('currentPage'));
    var totalPages = parseInt(this.get('totalPages'));

    var toShow = this.get('numPagesToShow');

    var t = TruncatePages.create({currentPage: currentPage, totalPages: totalPages, 
                                  numPagesToShow: toShow});
    var pages = t.get('pagesToShow');

    return pages.map(function(page) {
      return {
        page: page,
        current: (currentPage === page)
      };
    });
  }.property('currentPage','totalPages','numPagesToShow'),

  pageItems: function() {
    if (this.get('truncatePages')) {
      return this.get('pageItemsTruncated');
    }
    else {
      return this.get('pageItemsAll');
    }
  }.property('currentPage','totalPages','truncatePages','numPagesToShow')
});