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
    s= (page-1)*2
    e = s+1
    @all[s..e]

  pageFromRequest: (request) ->
    q = request.queryParams
    res = if q then q.page else 1
    res = res || 1
    parseInt(res)

  totalPages: ->
    parseInt((parseFloat(@all.length)+1.99)/2.0)

c.reopenClass
  responseHash: (request,all,name) ->
    @create(request: request, all: all, name: name).responseHash()

`export default c`