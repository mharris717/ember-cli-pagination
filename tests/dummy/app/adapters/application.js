import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  namespace: "api",

  shouldReloadAll: function() { return true; }
});
