import Ember from 'ember';
import Util from 'ember-cli-pagination/util';

export default Ember.Mixin.create({
  queryParams: ["page"],
  page: "1",

  pageChanged: (function() {
    var hasSetPage = !!(this.get('content') && this.get('content').setPage);

    if (hasSetPage) {
      this.get('content').setPage(this.get('page'));
    } else {
      Util.log("ControllerLocalMixin#pageChanged can't set page");
    }
  }).observes("page"),

  totalPagesBinding: "content.totalPages"
});