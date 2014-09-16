`import Ember from 'ember'`
# `import PageControllerMixin from 'ember-cli-pagination/mixins/controller-mixin'`

c = Ember.ArrayController.extend
  actions:
    save: ->
      @forEach (t) -> t.save()

`export default c`