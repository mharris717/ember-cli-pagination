`import Ember from 'ember'`
`import PageControllerMixin from 'ember-cli-pagination/controller-mixin'`
`import PageControllerLocalMixin from 'ember-cli-pagination/controller-local-mixin'`

`import PageRouteMixin from 'ember-cli-pagination/route-mixin'`
`import PageRouteLocalMixin from 'ember-cli-pagination/route-local-mixin'`

Factory = Ember.Object.extend
  paginationTypeInner: ->
    res = @get('config').paginationType
    return res if res

    ops = @get('config').pagination
    return ops.type if ops

    null

  paginationType: ->
    res = @paginationTypeInner()
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