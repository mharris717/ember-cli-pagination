import Ember from 'ember';
import PagedArray from 'ember-cli-pagination/paged-array';
import Util from 'ember-cli-pagination/util';

export default Ember.Mixin.create({
  findPaged: function(name, params) {
    var page = parseInt(params.page || 1);
    var perPage = parseInt(params.perPage || 10);
    var all = this.store.find(name);
    var allLength = all.get('length');

    var res = PagedArray.create({
      page: page,
      content: all,
      perPage: perPage
    });
    Util.log("RouteLocalMixin#findPaged page " + page + " allLength " + allLength);

    return res;
  }
});