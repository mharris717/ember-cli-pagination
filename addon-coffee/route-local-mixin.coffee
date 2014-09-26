`import Ember from 'ember'`
`import PagedArray from 'ember-cli-pagination/paged-array'`
`import Util from 'ember-cli-pagination/util'`

c = Ember.Mixin.create
  findPaged: (name,params) ->
    page = parseInt(params.page || 1)
    perPage = parseInt(params.perPage || 10)

    all = @store.find(name)
    allLength = all.get('length')
    res = PagedArray.create(page: page, content: all, perPage: perPage)
    Util.log "RouteLocalMixin#findPaged page #{page} allLength #{allLength}"
    res
    

`export default c`