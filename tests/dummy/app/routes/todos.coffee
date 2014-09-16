`import Ember from 'ember'`
`import PageRouteMixin from 'ember-cli-pagination/route-mixin'`

c = Ember.Route.extend PageRouteMixin,
  model: (params) ->
    @store.find('todo')


`export default c`