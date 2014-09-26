`import Ember from 'ember'`
`import PageControllerMixin from 'ember-cli-pagination/controller-mixin'`
`import PageControllerLocalMixin from 'ember-cli-pagination/controller-local-mixin'`

`import PageRouteMixin from 'ember-cli-pagination/route-mixin'`
`import PageRouteLocalMixin from 'ember-cli-pagination/route-local-mixin'`

Factory = Ember.Object.extend
  paginationType: ->
    res = @get('config').paginationType
    throw "unknown pagination type" unless res == "local" || res == "remote"
    res

  controllerMixin: ->
    {local: PageControllerLocalMixin, remote: PageControllerMixin}[@paginationType()]

  routeMixin: ->
    {local: PageRouteLocalMixin, remote: PageRouteMixin}[@paginationType()]

Factory.reopenClass
  controllerMixin: (config) ->
    Factory.create(config: config).controllerMixin()

  routeMixin: (config) ->
    Factory.create(config: config).routeMixin()

`export default Factory`