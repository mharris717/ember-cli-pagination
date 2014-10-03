`import Ember from 'ember'`
`import Factory from 'ember-cli-pagination/factory'`
`import config from '../config/environment'`

c = Ember.Route.extend Factory.routeMixin(config),
  model: (params) ->
    @findPaged 'todo', params

`export default c`