import Ember from 'ember';
import PagedRemoteArray from './paged-remote-array';

export default Ember.Mixin.create({
  perPage: 10,
  startingPage: 1,

  findPaged: function(name, params) {
    return PagedRemoteArray.create({
      page: params.page || this.get('startingPage'),
      perPage: params.perPage || this.get('perPage'),
      modelName: name,
      store: this.store
    });
  }
});
