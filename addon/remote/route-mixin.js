import Ember from 'ember';
import PagedRemoteArray from './paged-remote-array';
import Util from '../util';

export default Ember.Mixin.create({
  perPage: 10,
  startingPage: 1,

  model: function(params) {
    return this.findPaged(this._findModelName(this.get('routeName')), params);
  },

  _findModelName: function(routeName) {
      return Ember.String.singularize(
        Ember.String.camelize(routeName)
      );
  },

  findPaged: function(name, params) {
    var mainOps = {
      page: params.page || this.get('startingPage'),
      perPage: params.perPage || this.get('perPage'),
      modelName: name,
      store: this.store
    };

    var otherOps = Util.paramsOtherThan(params,["page","perPage"]);
    mainOps.otherParams = otherOps;

    return PagedRemoteArray.create(mainOps);
  }
});
