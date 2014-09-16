`import Ember from 'ember'`

c = Ember.Mixin.create
  findPaged: (name,params) ->
    page = parseInt(params.page || 1)
    @store.find(name,page: page)

`export default c`