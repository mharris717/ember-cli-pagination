import Ember from 'ember';
import PagedRemoteArray from './paged-remote-array';

export default Ember.Mixin.create({
  findPaged: function(name, params) {
    return PagedRemoteArray.create({
      page: params.page,
      perPage: params.perPage,
      modelName: name,
      store: this.store
    });
  }
});
