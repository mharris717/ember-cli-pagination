import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  namespace: "api",

  shouldReloadAll: function() { return true; }
});
