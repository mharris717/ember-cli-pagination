`import Ember from 'ember'`
`import Util from 'ember-cli-pagination/util'`

PagedRemoteArray = Ember.ArrayProxy.extend
  page: 1

  fetchContent: ->
    Util.log "PagedRemoteArray#fetchContent"

    page = parseInt(@get('page') || 1)
    perPage = parseInt(@get('perPage'))

    store = @get('store')
    modelName = @get('modelName')

    ops = {page: page}
    ops.per_page = perPage if perPage

    res = store.find(modelName, ops)

    res.then (rows) =>
      Util.log "PagedRemoteArray#fetchContent in res.then #{rows}"
      @set "meta", rows.meta

    res

  content: (-> @fetchContent()).property("page")

  totalPagesBinding: "meta.total_pages"

  setPage: (page) ->
    @set 'page', page

c = Ember.Mixin.create
  findPaged: (name,params) ->
    PagedRemoteArray.create(page: params.page, perPage: params.perPage, modelName: name, store: @store)

`export default c`