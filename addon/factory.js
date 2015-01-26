import Ember from 'ember';
import PageControllerMixin from 'ember-cli-pagination/remote/controller-mixin';
import PageControllerLocalMixin from 'ember-cli-pagination/local/controller-local-mixin';
import PageRouteMixin from 'ember-cli-pagination/remote/route-mixin';
import PageRouteLocalMixin from 'ember-cli-pagination/local/route-local-mixin';

var Factory = Ember.Object.extend({
  paginationTypeInner: function() {
    var res = this.get('config').paginationType;
    if (res) {
      return res;
    }
    var ops = this.get('config').pagination;
    if (ops) {
      return ops.type;
    }
    return null;
  },

  paginationType: function() {
    var res = this.paginationTypeInner();
    if (!(res === "local" || res === "remote")) {
      throw "unknown pagination type";
    }
    return res;
  },

  controllerMixin: function() {
    return {
      local: PageControllerLocalMixin,
      remote: PageControllerMixin
    }[this.paginationType()];
  },

  routeMixin: function() {
    return {
      local: PageRouteLocalMixin,
      remote: PageRouteMixin
    }[this.paginationType()];
  }
});

Factory.reopenClass({
  controllerMixin: function(config) {
    return Factory.create({config: config}).controllerMixin();
  },
  routeMixin: function(config) {
    return Factory.create({config: config}).routeMixin();
  }
});

export default Factory;
