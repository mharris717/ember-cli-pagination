`import Ember from 'ember'`
`import PageControllerMixin from 'ember-cli-pagination/controller-mixin'`

c = Ember.ArrayController.extend PageControllerMixin,
  actions:
    save: ->
      @forEach (t) -> t.save()

`export default c`