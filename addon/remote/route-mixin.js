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

  findPaged: function(name, params, callback) {
    var mainOps = {
      page: params.page || this.get('startingPage'),
      perPage: params.perPage || this.get('perPage'),
      modelName: name,
      store: this.store
    };

    if (params.paramMapping) {
      mainOps.paramMapping = params.paramMapping;
    }

    var otherOps = Util.paramsOtherThan(params,["page","perPage","paramMapping"]);
    mainOps.otherParams = otherOps;

    mainOps.initCallback = callback;

    return PagedRemoteArray.create(mainOps);
  }
});
