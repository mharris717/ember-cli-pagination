import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

export default Ember.Mixin.create({
  queryParams: ["page", "perPage"],
  page: "1",

  pageChanged: (function() {
    Util.log("PageControllerMixin#pageChanged");
    var p = parseInt(this.get('page'));
    if (this.get('content') && this.get('content').setPage) {
      this.get('content').setPage(p);
    }
  }).observes('page'),

  totalPagesBinding: "content.totalPages"
});
