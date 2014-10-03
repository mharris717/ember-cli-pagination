`import Ember from 'ember'`

c = Ember.Object.extend
  responseHash: ->
    page = @pageFromRequest(@request)

    k = "#{@name}s"
    res = {}
    res[k] = @objsForPage(page)
    res.meta = {total_pages: @totalPages()}

    res

  objsForPage: (page) ->
    perPage = @perPageFromRequest(@request)
    s= (page-1)*perPage
    e = s+1
    @all[s..e]

  pageFromRequest: (request) ->
    res = request.queryParams.page || 1
    parseInt(res)

  perPageFromRequest: (request) ->
    res = request.queryParams.per_page || 10
    console.debug "perPage: #{res}"
    console.debug request.queryParams
    parseInt(res)

  totalPages: ->
    perPage = @perPageFromRequest(@request)
    parseInt((parseFloat(@all.length)+parseFloat(perPage)-0.01)/parseFloat(perPage))

c.reopenClass
  responseHash: (request,all,name) ->
    @create(request: request, all: all, name: name).responseHash()

`export default c`