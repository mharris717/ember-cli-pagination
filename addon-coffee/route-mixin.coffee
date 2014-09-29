`import Ember from 'ember'`
`import Util from 'ember-cli-pagination/util'`

PagedRemoteArray = Ember.ArrayProxy.extend
  page: 1
  perPage: 10

  fetchContent: ->
    Util.log "PagedRemoteArray#fetchContent"

    page = parseInt(@get('page') || 1)
    store = @get('store')
    modelName = @get('modelName')

    res = store.find(modelName, page: page)

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
    PagedRemoteArray.create(page: params.page, modelName: name, store: @store)

`export default c`