`import Ember from 'ember'`
# `import PageRouteMixin from 'ember-cli-pagination/route-mixin'`

c = Ember.Route.extend
  model: (params) ->
    @store.find('todo')


`export default c`