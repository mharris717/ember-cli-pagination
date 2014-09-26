`import Ember from 'ember'`
`import PagedArray from 'ember-cli-pagination/paged-array'`

c = Ember.Mixin.create
  findPaged: (name,params) ->
    page = parseInt(params.page || 1)
    all = @store.find(name)
    allLength = all.get('length')
    res = PagedArray.create(page: page, content: all)
    console.debug "RouteLocalMixin#findPaged page #{page} allLength #{allLength}"
    res
    

`export default c`