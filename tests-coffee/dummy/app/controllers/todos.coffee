`import Ember from 'ember'`
`import Factory from 'ember-cli-pagination/factory'`
`import config from '../config/environment'`

c = Ember.ArrayController.extend Factory.controllerMixin(config),
  actions:
    save: ->
      @forEach (t) -> t.save()

`export default c`