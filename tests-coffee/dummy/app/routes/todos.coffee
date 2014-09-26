`import Ember from 'ember'`
`import Factory from 'ember-cli-pagination/factory'`
`import config from '../config/environment'`

c = Ember.Route.extend Factory.routeMixin(config),
  model: (params) ->
    params.perPage = params.perPage || 2
    @findPaged 'todo', params

`export default c`